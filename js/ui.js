import midiToFrequency from "./utils.js";

function addAudioSwitchListener(audioContext) {
  document.querySelector("#resume-button").addEventListener("click", () => {
    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        document.querySelector("#resume-indicator").classList.add("on");
      });
    } else if (audioContext.state === "running") {
      audioContext.suspend().then(() => {
        document.querySelector("#resume-indicator").classList.remove("on");
      });
    }
  });
}

function addParameterListeners(synthesizer) {
  const frequencyControl = document.querySelector("#frequency-control");
  frequencyControl.addEventListener("input", () => {
    synthesizer.filterFrequency = frequencyControl.value;
  });

  const resonanceControl = document.querySelector("#resonance-control");
  resonanceControl.addEventListener("input", () => {
    synthesizer.filterResonance = resonanceControl.value;
  });

  const outputControl = document.querySelector("#output-control");
  outputControl.addEventListener("input", () => {
    synthesizer.outputGain = outputControl.value;
  });
}

function addKeyboardListener(synthesizer) {
  const KEY_TO_FREQUENCY = new Map([
    ["a", midiToFrequency(60)], // C
    ["w", midiToFrequency(61)], // C#
    ["s", midiToFrequency(62)], // D
    ["e", midiToFrequency(63)], // D#
    ["d", midiToFrequency(64)], // E
    ["f", midiToFrequency(65)], // F
    ["t", midiToFrequency(66)], // F#
    ["g", midiToFrequency(67)], // G
    ["y", midiToFrequency(68)], // G#
    ["h", midiToFrequency(69)], // A
    ["u", midiToFrequency(70)], // A#
    ["j", midiToFrequency(71)], // B
    ["k", midiToFrequency(72)] // C
  ]);

  document.addEventListener("keypress", event => {
    if (KEY_TO_FREQUENCY.has(event.key)) {
      synthesizer.noteOn(KEY_TO_FREQUENCY.get(event.key));
      setTimeout(() => synthesizer.noteOff(), 250);
    }
  });
}

function addDeviceSelectorListener(midi) {
  document
    .querySelector("#midi-device-selector")
    .addEventListener("change", event => {
      midi.setDevice(event.target.value);
    });
}

function addChannelSelectorListener(midi) {
  document
    .querySelector("#midi-channel-selector")
    .addEventListener("change", event => {
      midi.channel = parseInt(event.target.value, 10);
    });
}

export function addMIDIInputs(inputs) {
  const select = document.querySelector("#midi-device-selector");
  inputs.forEach(input => {
    const option = document.createElement("option");
    option.appendChild(
      document.createTextNode(`${input.name} (${input.manufacturer})`)
    );
    option.value = input.id;
    select.appendChild(option);
  });
}

export function initializeEvents(audioContext, synthesizer, midi) {
  addAudioSwitchListener(audioContext);
  addParameterListeners(synthesizer);
  addKeyboardListener(synthesizer);
  if (midi) {
    addDeviceSelectorListener(midi);
    addChannelSelectorListener(midi);
    addMIDIInputs(midi.inputs);
  }
}

export function indicateIncomingMessage() {
  const indicatorClasses = document.querySelector("#midi-indicator").classList;
  if (indicatorClasses.contains("on")) {
    clearInterval(window.blinkTimeout);
  } else {
    indicatorClasses.add("on");
  }
  window.blinkTimeout = setTimeout(() => indicatorClasses.remove("on"), 125);
}
