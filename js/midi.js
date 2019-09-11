import { midiToFrequency } from "./utils.js";

export function initializeMIDI(messageConsumer) {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(
            midi => {
                // TODO: Add selectable MIDI input
                for (let input of midi.inputs.values()) {
                    input.onmidimessage = messageConsumer;
                }
            },
            () => {
                alert("An error occured while accessing MIDI devices.");
            }
        );
    } else {
        alert(
            "Your browser does not support MIDI. External input is disabled."
        );
    }
}

// TODO: Does it belong in this file?
// TODO: Create interface for synthesizer
export function controlSynthesizerWithMIDI(message, synthesizer, callback) {
    const [status, data1, data2] = message.data;
    // TODO: Add support for other channels
    if (status === 144) {
        const volume = data2 / 127;
        synthesizer.playNote(midiToFrequency(data1), volume);
        callback(); // TODO: Async?
    } else if (status === 128) {
        // Note off
    }
}
