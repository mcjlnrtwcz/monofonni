import Synthesizer from "./synthesizer.js";
import MIDI from "./midi.js";
import { initializeEvents, indicateIncomingMessage } from "./ui.js";

const context = new AudioContext();
const synthesizer = new Synthesizer(context);
const midi = new MIDI(synthesizer, indicateIncomingMessage);

midi.initializeMIDI().then(
  () => initializeEvents(context, synthesizer, midi),
  error => alert(error)
);
