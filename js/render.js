import { Synthesizer } from "./synthesizer.js";

const context = new OfflineAudioContext(1, 48000 * 5, 48000);
const synthesizer = new Synthesizer(context);

let file = null;
function prepareFile(contents) {
    const data = new Blob([contents], {type: 'audio/wav'});
    if (file !== null) {
        // Avoid memory leaks
        window.URL.revokeObjectURL(file);
    }
    file = window.URL.createObjectURL(data);
    return file;
}

context.startRendering().then(buffer => {
    const link = document.createElement('a');
    link.setAttribute('download', 'render.wav');
    link.href = prepareFile(buffer.getChannelData(0));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
synthesizer.playNote(250);
