import { Synthesizer } from "./synthesizer.js";

function midiToFrequency(noteNumber) {
    return Math.pow(2, (noteNumber - 69) / 12) * 440;
}

const FREQUENCIES = {
    "a": midiToFrequency(60), // C
    "w": midiToFrequency(61), // C#
    "s": midiToFrequency(62), // D
    "e": midiToFrequency(63), // D#
    "d": midiToFrequency(64), // E
    "f": midiToFrequency(65), // F
    "t": midiToFrequency(66), // F#
    "g": midiToFrequency(67), // G
    "y": midiToFrequency(68), // G#
    "h": midiToFrequency(69), // A
    "u": midiToFrequency(70), // A#
    "j": midiToFrequency(71), // B
    "k": midiToFrequency(72), // C
}

/* Audio nodes */

const context = new AudioContext();
// const context = new OfflineAudioContext(1, 48000 * 5, 48000);

const synthesizer = new Synthesizer(context);

/* UI controls */

document.addEventListener("keypress", (event) => {
    if (FREQUENCIES.hasOwnProperty(event.key)) {
        synthesizer.playNote(FREQUENCIES[event.key]);
    }
});

const frequencyControl = document.querySelector("#frequency-control");
frequencyControl.addEventListener("input", () => synthesizer.filterFrequency = frequencyControl.value);

const resonanceControl = document.querySelector("#resonance-control");
resonanceControl.addEventListener("input", () => synthesizer.filterResonance = resonanceControl.value);

const outputControl = document.querySelector("#output-control");
outputControl.addEventListener("input", () => synthesizer.outputGain = outputControl.value);

/* Offline */

/*
let file = null;
function prepareFile(contents) {
    const data = new Blob([contents], {type: 'text/plain'});
    // If we are replacing a previously generated file we need to manually revoke the object URL to avoid memory leaks.
    if (file !== null) {
        window.URL.revokeObjectURL(file);
    }
    file = window.URL.createObjectURL(data);
    return file;
}

context.startRendering().then(buffer => {
    var link = document.createElement('a');
    link.setAttribute('download', 'info.txt');
    link.href = prepareFile(buffer.getChannelData(0));
    document.body.appendChild(link);
    // link.click();
    document.body.removeChild(link);
});
synthesizer.playNote(250);
*/
