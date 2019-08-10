# monofonni

The purpose of this project is to build a simple monophonic synthesizer using Web Audio API.

## Try it in a browser

Visit https://mcjlnrtwcz.github.io/monofonni/

## Run locally
Execute
```bash
$ npm install http-server -g
$ http-server -p 3000 --cors
```
and visit http://127.0.0.1:3000

## Keyboard controls

Notes are mapped to the folliwng keys:

| C | C# | D | D# | E | F | F# | G | G# | A | A# | B | C |
|---|----|---|----|---|---|----|---|----|---|----|---|---|
| A | W  | S | E  | D | F | T  | G | Y  | H | U  | J | K |

## Offline rendering

In order to debug audio issues, the signal can be rendered offile. Visit `render.html` and save file to disk.

## External resources
Articles that I've found helpful while working on the project.

### Filters
* https://www.earlevel.com/main/2016/09/29/cascading-filters/

### WAVE file format
* http://soundfile.sapp.org/doc/WaveFormat/
* http://www-mmsp.ece.mcgill.ca/Documents/AudioFormats/WAVE/WAVE.html
