export default function midiToFrequency(noteNumber) {
  return Math.pow(2, (noteNumber - 69) / 12) * 440;
}
