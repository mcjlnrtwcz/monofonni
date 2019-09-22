import { midiToFrequency } from "./utils.js";

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

export class MIDI {
    constructor(MIDIInputHandler) {
        this.MIDIInputHandler = MIDIInputHandler;
        this.MIDIAccess = null;
        this.device = null;
    }

    initializeMIDI() {
        if (navigator.requestMIDIAccess) {
            return navigator.requestMIDIAccess().then(
                MIDIAccess => {
                    this.MIDIAccess = MIDIAccess;
                },
                () => {
                    throw Error("An error occured while accessing MIDI devices.");
                }
            );
        } else {
            return Promise.reject("Your browser does not support MIDI. External input is disabled.");
        }
    }

    get inputs() {
        const inputs = [];
        for (let input of this.MIDIAccess.inputs.values()) {
            inputs.push({id: input.id, manufacturer: input.manufacturer, name: input.name, });
        }
        return inputs;
    }

    setDevice(inputID) {
        for (let input of this.MIDIAccess.inputs.values()) {
            if (input.id === inputID) {
                input.onmidimessage = this.MIDIInputHandler;
            } else {
                input.onmidimessage = null;
            }
        }
    }
}
