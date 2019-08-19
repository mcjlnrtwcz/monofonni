import Synthesizer from "./synthesizer.js";
import { initializeMIDI, controlSynthesizerWithMIDI } from "./midi.js";
import { initializeEvents, indicateIncomingMessage } from "./ui.js";

const context = new AudioContext();
const synthesizer = new Synthesizer(context);
initializeMIDI(message =>
    controlSynthesizerWithMIDI(message, synthesizer, indicateIncomingMessage)
);
initializeEvents(context, synthesizer);
