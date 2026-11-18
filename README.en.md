# Ocarina Score

[中文说明](README.md) · [Open the editor in English](https://theramenes.github.io/ocarina-score/?lang=en)

A single-melody score editor for the ocarina in *The Legend of Zelda: Ocarina of Time Remake*. View standard notation and Nintendo Switch 2 controller fingerings side by side.

## Features

- **Score editing.** Edit with a Guitar Pro–style cursor. Change a note’s pitch or duration, insert notes before or after the cursor, or drag to select a passage for copying and pasting. Add rests, ties, triplets, and text annotations.
- **Transposition and fingerings.** If notes fall outside the in-game ocarina’s range, transpose the score a semitone at a time to find a more playable key. The button chart updates as you transpose. Choose alternate fingerings by hand or optimize a passage for easier transitions.
- **MIDI keyboards and controllers.** Use a MIDI keyboard to audition pitches or enter notes. Connect a controller to play with the in-game button layout, or start playback at the cursor and play along.
- **Score library and sharing.** Open a built-in Ocarina of Time melody or keep your own scores in the library. Import JSON, MIDI, QR-code images, or share links. Save a score as JSON or export a button chart image to share.

## Getting started

Open a built-in score from the Library or create a new one. Select a note, then use the duration toolbar and piano to edit it. Press **Space** to play from the cursor. The Guide covers editing, pitch bends, and connecting input devices.

Your personal library is stored in the current browser. Use exported JSON files or share links to move scores to another browser or device.

## Preview locally

Run `python -m http.server 8000` from the repository folder, then open the [static preview](http://127.0.0.1:8000/?storage=files&lang=en). The public edition is hosted on GitHub Pages.

## References and audio

- [Nintendo’s official melodies](https://www.nintendo.com/jp/games/switch2/aa9ja/melody/index.html)
- [Ocarina fingering and pitch reference](https://github.com/diacoviello/LoZ-Ocarina-Note-Charts)
- [FreePats ocarina recordings (CC0)](https://freepats.zenvoid.org/Wind/ocarina.html) · [Sample credits](assets/ocarina-source.txt)
