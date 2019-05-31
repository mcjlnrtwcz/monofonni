const context = new window.AudioContext();

const amp = context.createGain();
amp.connect(context.destination);

document.addEventListener("keypress", (event) => {
    if (event.key === "a") {
        const oscillator = context.createOscillator();
        oscillator.connect(amp);
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, 1000);
    }
});
