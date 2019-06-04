function midiToFrequency(noteNumber) {
    return Math.pow(2, (noteNumber - 69) / 12) * 440;
}

/** Map linear value (in range [0.0, 1.0]) to exponential value. */
function exponentialValue(linearValue) {
    return (Math.pow(10, parseFloat(linearValue)) - 1) / 10;
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

const context = new window.AudioContext();

const output = context.createGain();
output.connect(context.destination);

const amp = context.createGain();
amp.connect(output);
amp.gain.setValueAtTime(0, context.currentTime);

const oscillator = context.createOscillator();
oscillator.connect(amp);
oscillator.start();

document.addEventListener("keypress", (event) => {
    if (FREQUENCIES.hasOwnProperty(event.key)) {
        amp.gain.cancelScheduledValues(context.currentTime);
        oscillator.frequency.value = FREQUENCIES[event.key];
        amp.gain.setValueAtTime(1, context.currentTime);
        amp.gain.setTargetAtTime(0, context.currentTime + 0.25, 0.25);
    }
});

volume = document.querySelector("#volume");
volume.addEventListener("input", () => output.gain.value = exponentialValue(volume.value), false);
