# Ocarina Score

[中文说明](README.md) · [Open the editor in English](https://theramenes.github.io/ocarina-score/?lang=en)

A single-melody score editor for the ocarina in *The Legend of Zelda: Ocarina of Time Remake*. View standard notation and Nintendo Switch 2 controller fingerings side by side.

## Features

- Enter notes with the on-screen piano or a MIDI keyboard. Edit durations, rests, ties, triplets, and text annotations.
- Convert pitches to in-game fingerings, choose alternate fingerings for the same pitch, or optimize a passage for easier transitions.
- Play from the cursor with adjustable tempo, swing, looping, and master volume. Connect a controller to play along.
- Import JSON, MIDI, a shared image with a QR code, or a share link. Saving exports a JSON file and adds the score to this browser’s library. Creator credits appear in the library and on shared images when provided.
- Switch between light and dark themes and between English and Chinese from the header. The browser remembers your preferences.

## Getting started

Open a built-in score from the Library or create a new one. Select a note, then use the duration toolbar and piano to edit it. Press **Space** to play from the cursor. The Guide covers editing, pitch bends, and connecting input devices.

Your personal library is stored in the current browser. Use exported JSON files or share links to move scores to another browser or device.

## Preview locally

Run `python -m http.server 8000` from the repository folder, then open the [static preview](http://127.0.0.1:8000/?storage=files&lang=en). The public edition is hosted on GitHub Pages.

## References and audio

- [Nintendo’s official melodies](https://www.nintendo.com/jp/games/switch2/aa9ja/melody/index.html)
- [Ocarina fingering and pitch reference](https://github.com/diacoviello/LoZ-Ocarina-Note-Charts)
- [FreePats ocarina recordings (CC0)](https://freepats.zenvoid.org/Wind/ocarina.html) · [Sample credits](assets/ocarina-source.txt)
