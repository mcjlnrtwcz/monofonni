function midiToFrequency(noteNumber) {
    return Math.pow(2, (noteNumber - 69) / 12) * 440;
}

/** Map linear value (in range [0.0, 1.0]) to exponential value (in custom range). */
function exponentialValue(linearValue, minValue=0.0, maxValue = 1.0) {
    return ((Math.pow(10, linearValue) - 1) / 9) * (maxValue - minValue) + minValue;
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

/* Audio nodes */

const context = new window.AudioContext();

const output = context.createGain();
output.connect(context.destination);

const amp = context.createGain();
amp.connect(output);
amp.gain.setValueAtTime(0, context.currentTime);

const filterA = context.createBiquadFilter();
filterA.frequency.value = 8000;
// Cascading filters, see https://www.earlevel.com/main/2016/09/29/cascading-filters/
filterA.Q.value = 1.3065630;
filterA.connect(amp);
const filterB = context.createBiquadFilter();
filterB.frequency.value = 8000;
filterB.Q.value = 0.54119610;
filterB.connect(filterA);

const oscillator = context.createOscillator();
oscillator.type = "square";
oscillator.connect(filterB);
oscillator.start();

/* Controls */

document.addEventListener("keypress", (event) => {
    if (FREQUENCIES.hasOwnProperty(event.key)) {
        amp.gain.cancelScheduledValues(context.currentTime);
        oscillator.frequency.value = FREQUENCIES[event.key];
        amp.gain.setValueAtTime(1, context.currentTime);
        amp.gain.setTargetAtTime(0, context.currentTime + 0.25, 0.25);
    }
});

filterControl = document.querySelector("#filter-control");
filterControl.addEventListener(
    "input",
    () => {
        const freq = exponentialValue(filterControl.value, 32, 8000);
        filterA.frequency.value = freq;
        filterB.frequency.value = freq;
    },
    false
);

outputControl = document.querySelector("#output-control");
outputControl.addEventListener("input", () => output.gain.value = exponentialValue(outputControl.value), false);
