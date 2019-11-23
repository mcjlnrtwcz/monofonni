export default function midiToFrequency(noteNumber) {
  return 2 ** ((noteNumber - 69) / 12) * 440;
}
