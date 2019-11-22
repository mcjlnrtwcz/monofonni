import { midiToFrequency } from "./utils.js";

const STATUS = {
    NOTE_ON: 144,
    NOTE_OFF: 128,
};

export default class MIDI {
    constructor(synthesizer, noteUICallback) {
        this.synthesizer = synthesizer;
        this.noteUICallback = noteUICallback;
        this.MIDIAccess = null;
        this.device = null;
        this.channel = 1;
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
        const channelOffset = this.channel - 1;
        if (status === STATUS.NOTE_ON + channelOffset) {
            const volume = data2 / 127;
            this.synthesizer.noteOn(midiToFrequency(data1), volume);
            this.noteUICallback(); // TODO: Async?
        } else if (status == STATUS.NOTE_OFF + channelOffset) {
            this.synthesizer.noteOff();
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
