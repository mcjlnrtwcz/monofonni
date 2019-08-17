import Synthesizer from "./synthesizer.js";
import { initializeMIDI, controlSynthesizerWithMIDI } from "./midi.js";
import { midiToFrequency } from "./utils.js";

const KEY_TO_FREQUENCY = {
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
};

const context = new AudioContext();
const synthesizer = new Synthesizer(context);
initializeMIDI((message) => controlSynthesizerWithMIDI(message, synthesizer));

document.addEventListener("keypress", (event) => {
    if (KEY_TO_FREQUENCY.hasOwnProperty(event.key)) {
        synthesizer.playNote(KEY_TO_FREQUENCY[event.key]);
    }
});

const frequencyControl = document.querySelector("#frequency-control");
frequencyControl.addEventListener("input", () => synthesizer.filterFrequency = frequencyControl.value);

const resonanceControl = document.querySelector("#resonance-control");
resonanceControl.addEventListener("input", () => synthesizer.filterResonance = resonanceControl.value);

const outputControl = document.querySelector("#output-control");
outputControl.addEventListener("input", () => synthesizer.outputGain = outputControl.value);

// TODO: How to handle output from resume?
document.querySelector("#resume-button").addEventListener("click", (event) => {
    if (context.state === "suspended") {
        context.resume().then(() => {
            document.querySelector("#resume-indicator").className = "indicator on";
        });
    } else if (context.state === "running") {
        context.suspend().then(() => {
            document.querySelector("#resume-indicator").className = "indicator off";
        });
    }
    // TODO: Other options?
});
