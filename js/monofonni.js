import Synthesizer from "./synthesizer.js";
import { initializeMIDI, controlSynthesizerWithMIDI } from "./midi.js";
import { initializeEvents, indicateIncomingMessage, addMIDIInputs } from "./ui.js";

const context = new AudioContext();
const synthesizer = new Synthesizer(context);
initializeMIDI(addMIDIInputs).then(
    MIDIAccess => {
        initializeEvents(
            context,
            synthesizer,
            message => controlSynthesizerWithMIDI(message, synthesizer, indicateIncomingMessage),
            MIDIAccess
        );
    },
    error => {
        alert(error);
        initializeEvents(context, synthesizer);
    }
);
