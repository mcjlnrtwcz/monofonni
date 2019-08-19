import { midiToFrequency } from "./utils.js";

function addAudioSwitchListener(audioContext) {
    // TODO: How to handle output from resume?
    document.querySelector("#resume-button").addEventListener("click", () => {
        if (audioContext.state === "suspended") {
            audioContext.resume().then(() => {
                document.querySelector("#resume-indicator").classList.add("on");
            });
        } else if (audioContext.state === "running") {
            audioContext.suspend().then(() => {
                document
                    .querySelector("#resume-indicator")
                    .classList.remove("on");
            });
        }
        // TODO: Other options?
    });
}

function addParameterListeners(synthesizer) {
    const frequencyControl = document.querySelector("#frequency-control");
    frequencyControl.addEventListener(
        "input",
        () => (synthesizer.filterFrequency = frequencyControl.value)
    );

    const resonanceControl = document.querySelector("#resonance-control");
    resonanceControl.addEventListener(
        "input",
        () => (synthesizer.filterResonance = resonanceControl.value)
    );

    const outputControl = document.querySelector("#output-control");
    outputControl.addEventListener(
        "input",
        () => (synthesizer.outputGain = outputControl.value)
    );
}

function addKeyboardListener(synthesizer) {
    const KEY_TO_FREQUENCY = {
        a: midiToFrequency(60), // C
        w: midiToFrequency(61), // C#
        s: midiToFrequency(62), // D
        e: midiToFrequency(63), // D#
        d: midiToFrequency(64), // E
        f: midiToFrequency(65), // F
        t: midiToFrequency(66), // F#
        g: midiToFrequency(67), // G
        y: midiToFrequency(68), // G#
        h: midiToFrequency(69), // A
        u: midiToFrequency(70), // A#
        j: midiToFrequency(71), // B
        k: midiToFrequency(72) // C
    };

    document.addEventListener("keypress", event => {
        if (KEY_TO_FREQUENCY.hasOwnProperty(event.key)) {
            synthesizer.playNote(KEY_TO_FREQUENCY[event.key]);
        }
    });
}

export function initializeEvents(audioContext, synthesizer) {
    addAudioSwitchListener(audioContext);
    addParameterListeners(synthesizer);
    addKeyboardListener(synthesizer);
}

export function indicateIncomingMessage() {
    document.querySelector("#midi-indicator").classList.add("on");
    setTimeout(
        () => document.querySelector("#midi-indicator").classList.remove("on"),
        125
    );
}
