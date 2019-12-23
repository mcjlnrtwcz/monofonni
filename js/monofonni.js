import Synthesizer from "./synthesizer.js";
import MIDI from "./midi.js";
import {
  initializeEvents,
  indicateIncomingMessage,
  setChannel,
  setDevice
} from "./ui.js";

const context = new AudioContext();
const synthesizer = new Synthesizer(context);
const midi = new MIDI(synthesizer, indicateIncomingMessage);

midi.initializeMIDI().then(
  () => initializeEvents(context, synthesizer, midi),
  error => alert(error)
);

window.setDevice = (deviceID, deviceName) =>
  setDevice(midi, deviceID, deviceName);
window.setChannel = channel => setChannel(midi, channel);
