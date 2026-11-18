# 时之笛 · 陶笛曲谱

[English README](README.en.md) · [打开制谱工具](https://theramenes.github.io/ocarina-score/)

面向《塞尔达传说：时之笛》重制版陶笛演奏的单声部制谱工具。可以同时查看五线谱和 Nintendo Switch 2 手柄按键谱。

## 能做什么

- 用屏幕琴键或 MIDI 键盘录入音符，编辑时值、休止符、延音、三连音和文字备注。
- 自动转换游戏按法，也可手动选择同音的替代按法，或优化整段音符的换键。
- 从光标播放曲谱，调整 BPM、Swing、循环和总音量。连接手柄后可以跟着曲谱自己吹奏。
- 导入 JSON、MIDI、二维码分享图或分享链接。保存曲谱会导出 JSON，并把曲谱加入当前浏览器的曲谱库。曲谱库和分享图会显示已填写的制作者。
- 在页头切换浅色／深色模式和中文／English。偏好保存在当前浏览器。

## 开始使用

从「曲谱库」打开内置曲谱，或新建一份。选中音符后，用时值工具和屏幕琴键编辑。按 **Space** 从光标位置播放。点击「使用演奏说明」可查看输入、变音和设备连接方法。

自定义曲谱库保存在当前浏览器。换设备或浏览器时，可导入已保存的 JSON 文件或使用分享链接。

## 本地预览

在此仓库目录运行 `python -m http.server 8000`，然后打开 [静态预览](http://127.0.0.1:8000/?storage=files)。在线版由 GitHub Pages 直接托管。

## 资料和音源

- [任天堂官方曲谱](https://www.nintendo.com/jp/games/switch2/aa9ja/melody/index.html)
- [时之笛按键与音高对照](https://github.com/diacoviello/LoZ-Ocarina-Note-Charts)
- [FreePats 陶笛实录采样（CC0）](https://freepats.zenvoid.org/Wind/ocarina.html) · [采样来源详情](assets/ocarina-source.txt)
