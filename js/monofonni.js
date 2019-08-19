import Synthesizer from "./synthesizer.js";
import { initializeMIDI, controlSynthesizerWithMIDI } from "./midi.js";
import { initializeEvents } from "./ui.js";

function blink() {
    document.querySelector("#midi-indicator").classList.add("on");
    setTimeout(
        () => document.querySelector("#midi-indicator").classList.remove("on"),
        125
    );
}

const context = new AudioContext();
const synthesizer = new Synthesizer(context);
initializeMIDI(message =>
    controlSynthesizerWithMIDI(message, synthesizer, blink)
);
initializeEvents(context, synthesizer);
