const context = new window.AudioContext();

const amp = context.createGain();
amp.connect(context.destination);

const oscillator = context.createOscillator();
oscillator.start();
oscillator.connect(amp);

const lfoDepth = context.createGain();
lfoDepth.gain.value = 0.5;
lfoDepth.connect(amp.gain);

const lfo = context.createOscillator();
lfo.frequency.value = 0.5;
lfo.connect(lfoDepth);
lfo.start();
