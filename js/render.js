import Synthesizer from "./synthesizer.js";

function initializeFileBuffer(
  numChannels,
  sampleRate,
  bitsPerSample,
  lengthSeconds
) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const subchunk2Size = lengthSeconds * byteRate;
  const chunkSize = 36 + subchunk2Size;

  const buffer = new ArrayBuffer(chunkSize + 8);
  const dataView = new DataView(buffer);

  // "RIFF"
  dataView.setUint8(0, 82);
  dataView.setUint8(1, 73);
  dataView.setUint8(2, 70);
  dataView.setUint8(3, 70);
  // file size - 8
  dataView.setUint32(4, chunkSize, true);
  // "WAVE"
  dataView.setUint8(8, 87);
  dataView.setUint8(9, 65);
  dataView.setUint8(10, 86);
  dataView.setUint8(11, 69);
  // "fmt "
  dataView.setUint8(12, 102);
  dataView.setUint8(13, 109);
  dataView.setUint8(14, 116);
  dataView.setUint8(15, 32);
  // size of first subchunk
  dataView.setUint32(16, 16, true);
  // 1 means PCM, 3 means IEEE float
  dataView.setUint16(20, 3, true);
  dataView.setUint16(22, numChannels, true);
  dataView.setUint32(24, sampleRate, true);
  dataView.setUint32(28, byteRate, true);
  // block align
  dataView.setUint16(32, (numChannels * bitsPerSample) / 8, true);
  dataView.setUint16(34, bitsPerSample, true);
  // "data"
  dataView.setUint8(36, 100);
  dataView.setUint8(37, 97);
  dataView.setUint8(38, 116);
  dataView.setUint8(39, 97);
  // size of audio data
  dataView.setUint32(40, subchunk2Size, true);

  return buffer;
}

function writeAudioData(audioData, fileBuffer) {
  const dataView = new DataView(fileBuffer);
  const maxValue = Math.max(
    Math.abs(Math.min(...audioData)),
    Math.max(...audioData)
  );
  let offset = 44; // WAVE header size
  for (const sample of audioData) {
    dataView.setFloat32(offset, sample / maxValue, true);
    offset += 4;
  }
}

const channels = 1;
const sampleRate = 48000;
const lengthSeconds = 5;
const context = new OfflineAudioContext(
  channels,
  sampleRate * lengthSeconds,
  sampleRate
);
const synthesizer = new Synthesizer(context);

context.startRendering().then(audioBuffer => {
  const fileBuffer = initializeFileBuffer(
    channels,
    sampleRate,
    32,
    lengthSeconds
  );
  writeAudioData(audioBuffer.getChannelData(0), fileBuffer);

  const data = new Blob([fileBuffer], { type: "audio/wav" });
  const file = window.URL.createObjectURL(data);

  const link = document.createElement("a");
  link.setAttribute("download", "render.wav");
  link.href = file;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Avoid memory leaks
  window.URL.revokeObjectURL(file);
});
synthesizer.noteOn(250);
setTimeout(() => synthesizer.noteOff(), 250);
