import { midiToFrequency } from "./utils.js";

export default class MIDI {
    constructor(synthesizer, noteUICallback) {
        this.synthesizer = synthesizer;
        this.noteUICallback = noteUICallback;
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

    handleMIDIMessage(message) {
        const [status, data1, data2] = message.data;
        // TODO: Add support for other channels
        if (status === 144) {
            const volume = data2 / 127;
            this.synthesizer.playNote(midiToFrequency(data1), volume);
            this.noteUICallback(); // TODO: Async?
        } else if (status === 128) {
            // Note off
        }
    }

    setDevice(inputID) {
        for (let input of this.MIDIAccess.inputs.values()) {
            if (input.id === inputID) {
                input.onmidimessage = (message) => this.handleMIDIMessage(message);
            } else {
                input.onmidimessage = null;
            }
        }
    }
}
