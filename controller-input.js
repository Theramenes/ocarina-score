"use strict";

const controllerActions = [
  ["stickUp", "左摇杆 ↑", { type: "axis", index: 1, neutral: 0, sign: -1 }],
  ["stickDown", "左摇杆 ↓", { type: "axis", index: 1, neutral: 0, sign: 1 }],
  ["dpadUp", "十字键 ↑", { type: "button", index: 12 }],
  ["dpadDown", "十字键 ↓", { type: "button", index: 13 }],
  ["L", "L", { type: "button", index: 4 }],
  ["R", "R", { type: "button", index: 5 }],
  ["A", "A", { type: "button", index: 1 }],
  ["Y", "Y", { type: "button", index: 2 }],
  ["X", "X", { type: "button", index: 3 }],
  ["tap", "+ / Start", { type: "button", index: 9 }]
];
const controllerProfiles = new Map();
let activeController = null;
let preferredController = null;
let controllerCalibration = null;
let controllerPanelSignature = "";
let controllerFeedback = null;
let controllerPanelUpdated = 0;

function controllerProfileKey(device) {
  return "ocarina-controller-v1:" + JSON.stringify([device.id, device.mapping, device.buttons.length, device.axes.length]);
}

function controllerProfile(device) {
  const key = controllerProfileKey(device);
  if (!controllerProfiles.has(key)) {
    let profile = {};
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "{}");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) profile = saved;
    }
    catch { /* Use the default bindings if storage is unavailable. */ }
    controllerProfiles.set(key, profile);
  }
  return controllerProfiles.get(key);
}

function controllerBinding(device, action) {
  const fallback = controllerActions.find(([name]) => name === action)[2];
  const binding = controllerProfile(device)[action];
  if (!binding || !Number.isInteger(binding.index) || binding.index < 0) return fallback;
  if (binding.type === "button" && binding.index < device.buttons.length) return binding;
  if (binding.index < device.axes.length && Number.isFinite(binding.neutral) &&
      ((binding.type === "axis" && Math.abs(binding.sign) === 1) ||
       (binding.type === "hat" && Number.isFinite(binding.value)))) return binding;
  return fallback;
}

function controllerInputHeld(device, binding) {
  if (binding.type === "button") {
    const button = device.buttons[binding.index];
    return Boolean(button?.pressed || button?.value > .5);
  }
  const value = device.axes[binding.index];
  if (!Number.isFinite(value)) return false;
  if (binding.type === "hat") {
    const distance = Math.abs(value - binding.value);
    // HID POV hats use eight positions from -1 to 1, with neutral above 1.
    if (Math.abs(binding.neutral) > 1.1 && Math.abs(value) <= 1.02) {
      return distance < 2 / 7 + .04 || distance > 2 - .04;
    }
    return distance < .08;
  }
  return (value - binding.neutral) * binding.sign > .55;
}

function readControllerControls(device) {
  const held = (action) => controllerInputHeld(device, controllerBinding(device, action));
  return {
    pressed: ["L", "R", "A", "Y", "X"].map(held),
    stick: Number(held("stickUp")) - Number(held("stickDown")),
    dpad: Number(held("dpadUp")) - Number(held("dpadDown")),
    tap: held("tap")
  };
}

function controllerBindingText(binding) {
  if (binding.type === "button") return tr("按钮 {index}", { index: binding.index });
  if (binding.type === "hat") return tr("方向轴 {index} · {value}", { index: binding.index, value: binding.value.toFixed(2) });
  return tr("轴 {index} · {direction}", { index: binding.index, direction: binding.sign > 0 ? "+" : "−" });
}

function renderControllerBindings() {
  const device = activeController;
  const renderRow = ([action, label]) => {
    const row = document.createElement("div");
    row.className = "controller-binding";
    const name = document.createElement("span");
    name.textContent = tr(label);
    const value = document.createElement("small");
    value.textContent = device ? controllerBindingText(controllerBinding(device, action)) : "—";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary device-button";
    button.textContent = tr("校准");
    button.disabled = !device;
    button.setAttribute("aria-label", tr("校准 {control}", { control: tr(label) }));
    button.onclick = () => {
      const current = activeController;
      if (!current) return;
      const axes = Array.from(current.axes);
      const buttons = current.buttons.map((entry) => Boolean(entry.pressed || entry.value > .5));
      controllerCalibration = { key: controllerProfileKey(current), action, axes, buttons, started: performance.now() };
      controllerFeedback = null;
      renderControllerFeedback();
    };
    row.append(name, value, button);
    return row;
  };
  $("controller-bends").replaceChildren(...controllerActions.slice(0, 4).map(renderRow));
  $("controller-main-buttons").replaceChildren(...controllerActions.slice(4).map(renderRow));
  $("controller-reset").disabled = !device || !Object.keys(controllerProfile(device)).length;
}

function renderControllerFeedback() {
  const calibration = controllerCalibration;
  const message = calibration ? tr("请按住或推住 {control}，保持片刻。", {
    control: tr(controllerActions.find(([name]) => name === calibration.action)[1])
  }) : controllerFeedback ? tr(controllerFeedback.message, controllerFeedback.values &&
    { control: tr(controllerFeedback.values.control) }) :
    tr("先松开所有按键并让摇杆回中，再点对应方向的「校准」。");
  const hint = $("controller-calibration-status");
  if (hint.textContent !== message) hint.textContent = message;
  $("controller-cancel").hidden = !calibration;
}

function detectControllerBinding(device, calibration) {
  const button = device.buttons.findIndex((entry, index) =>
    (entry.pressed || entry.value > .5) && !calibration.buttons[index]);
  if (button >= 0) return { type: "button", index: button };
  let index = -1;
  let distance = .5;
  device.axes.forEach((value, axis) => {
    const change = Math.abs(value - calibration.axes[axis]);
    if (Number.isFinite(change) && change > distance) { index = axis; distance = change; }
  });
  if (index < 0) return null;
  const neutral = calibration.axes[index];
  const value = device.axes[index];
  if (calibration.action.startsWith("dpad") || Math.abs(neutral) > 1.1) return { type: "hat", index, neutral, value };
  return { type: "axis", index, neutral, sign: Math.sign(value - neutral) };
}

function captureControllerBinding(device, now) {
  const calibration = controllerCalibration;
  if (!calibration || !document.hasFocus() || document.hidden) return;
  if (!device || controllerProfileKey(device) !== calibration.key) {
    controllerCalibration = null;
    controllerFeedback = { message: "手柄已断开，校准已取消。" };
    renderControllerFeedback();
    return;
  }
  const binding = detectControllerBinding(device, calibration);
  const candidate = JSON.stringify(binding);
  if (!binding || candidate !== calibration.candidate) {
    calibration.candidate = candidate;
    calibration.detectedAt = now;
    return;
  }
  if (now - calibration.detectedAt < 100) return;
  controllerProfile(device)[calibration.action] = binding;
  let saved = true;
  try { localStorage.setItem(calibration.key, JSON.stringify(controllerProfile(device))); }
  catch { saved = false; }
  controllerFeedback = {
    message: saved ? "已校准 {control}，此浏览器会记住这个手柄的设置。" : "已校准 {control}，设置保留到本次访问结束。",
    values: { control: controllerActions.find(([name]) => name === calibration.action)[1] }
  };
  controllerCalibration = null;
  renderControllerBindings();
  renderControllerFeedback();
}

function updateControllerPanel(device, devices, controls) {
  activeController = device ?? null;
  const now = performance.now();
  if (!$("pad-device-dialog").open) return;
  const signature = JSON.stringify([device && controllerProfileKey(device), devices.map((item) => [item.index, item.id])]);
  if (signature !== controllerPanelSignature) {
    controllerPanelSignature = signature;
    $("controller-device").replaceChildren(...devices.map((item) => new Option(item.id || tr("手柄 {number}", { number: item.index + 1 }), item.index)));
    $("controller-device").disabled = !devices.length;
    if (device) $("controller-device").value = device.index;
    renderControllerBindings();
  }
  captureControllerBinding(device, now);
  renderControllerFeedback();
  if (now - controllerPanelUpdated < 75) return;
  controllerPanelUpdated = now;
  $("controller-detected").textContent = !controls ? "—" : [
    ...["L", "R", "A", "Y", "X"].filter((_, index) => controls.pressed[index]),
    controls.stick && tr("左摇杆 {direction}", { direction: controls.stick > 0 ? "↑" : "↓" }),
    controls.dpad && tr("十字键 {direction}", { direction: controls.dpad > 0 ? "↑" : "↓" })
  ].filter(Boolean).join(" + ") || tr("未按键");
  if (!device) { $("controller-raw").textContent = "—"; return; }
  const pressed = device.buttons.flatMap((button, index) => button.pressed || button.value > .5 ? ["B" + index] : []);
  const axes = device.axes.map((value, index) => "A" + index + "=" + value.toFixed(2));
  $("controller-raw").textContent = [pressed.join(" ") || tr("未按键"), axes.join("  ")].join("\n");
}

function setupControllerPanel() {
  const dialog = $("pad-device-dialog");
  $("controller-device").onchange = (event) => {
    preferredController = Number(event.target.value);
    controllerCalibration = null;
    controllerFeedback = null;
    controllerPanelSignature = "";
  };
  $("controller-cancel").onclick = () => {
    controllerCalibration = null;
    controllerFeedback = null;
    renderControllerFeedback();
  };
  $("controller-reset").onclick = () => {
    if (!activeController) return;
    const key = controllerProfileKey(activeController);
    controllerProfiles.set(key, {});
    try { localStorage.removeItem(key); } catch { /* Defaults apply for this visit. */ }
    controllerCalibration = null;
    controllerFeedback = { message: "已恢复默认按键。" };
    renderControllerBindings();
    renderControllerFeedback();
  };
  const cancelCapture = () => { controllerCalibration = null; };
  dialog.addEventListener("close", cancelCapture);
  window.addEventListener("blur", cancelCapture);
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancelCapture(); });
  document.addEventListener("ocarina-language-change", () => {
    renderControllerBindings();
    renderControllerFeedback();
  });
}
