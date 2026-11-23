# 时之笛 · 陶笛曲谱

[English README](README.en.md) · [打开制谱工具](https://theramenes.github.io/ocarina-score/)

面向《塞尔达传说：时之笛》重制版陶笛演奏的单声部制谱工具。可以同时查看五线谱和 Nintendo Switch 2 手柄按键谱。

## 功能

- **曲谱编辑**采用类似 Guitar Pro 的光标操作。选中音符可以改音高和时值，在光标前后插入音符，或拖选一段复制粘贴。谱面支持休止符、延音、三连音和文字备注。
- 用**整谱移调**逐半音调整曲谱，让更多音落在游戏陶笛的音域内。按键谱随音高更新，也可以手动替换同音的按法，或优化一段旋律的换键。
- **外接设备**包括 MIDI 键盘和手柄。MIDI 键盘可以试听或录入音符。接上手柄，按游戏里的键位就能吹奏，也可以从光标处播放曲谱，跟着练习。
- **曲谱库**内置时之笛的旋律，也可以收录自己保存的曲谱。支持导入 JSON、MIDI、二维码分享图和分享链接。编辑后的曲谱可以保存为 JSON 或导出按键谱分享图。

## 开始使用

从「曲谱库」打开内置曲谱，或新建一份。选中音符后，用时值工具和屏幕琴键编辑。按 **Space** 从光标位置播放。点击「使用演奏说明」可查看输入、变音和设备连接方法。

自定义曲谱库保存在当前浏览器。换设备或浏览器时，可导入已保存的 JSON 文件或使用分享链接。

## 本地预览

在此仓库目录运行 `python -m http.server 8000`，然后打开 [静态预览](http://127.0.0.1:8000/?storage=files)。在线版由 GitHub Pages 直接托管。

## 资料和音源

- [任天堂官方曲谱](https://www.nintendo.com/jp/games/switch2/aa9ja/melody/index.html)
- [时之笛按键与音高对照](https://github.com/diacoviello/LoZ-Ocarina-Note-Charts)
- [FreePats 陶笛实录采样（CC0）](https://freepats.zenvoid.org/Wind/ocarina.html) · [采样来源详情](assets/ocarina-source.txt)
