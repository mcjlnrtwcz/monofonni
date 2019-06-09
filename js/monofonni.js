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

const context = new AudioContext();
const synthesizer = new Synthesizer(context);

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
