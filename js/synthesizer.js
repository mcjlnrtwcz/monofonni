/** Map linear value (in range [0.0, 1.0]) to exponential value (in custom range). */
function exponentialValue(linearValue, minValue = 0.0, maxValue = 1.0) {
  return ((10 ** linearValue - 1) / 9) * (maxValue - minValue) + minValue;
}

export default class Synthesizer {
  constructor(context) {
    this.context = context;

    this.output = context.createGain();
    this.output.connect(context.destination);

    this.amp = context.createGain();
    this.amp.connect(this.output);
    this.amp.gain.setValueAtTime(0, context.currentTime);

    this.filterA = context.createBiquadFilter();
    this.filterA.frequency.value = 8000;
    this.filterAdefualtQ = 1.306563;
    this.filterA.Q.value = this.filterAdefualtQ;
    this.filterA.connect(this.amp);

    this.filterB = context.createBiquadFilter();
    this.filterB.frequency.value = 8000;
    this.filterBdefaultQ = 0.5411961;
    this.filterB.Q.value = this.filterBdefaultQ;
    this.filterB.connect(this.filterA);

    this.oscillator = context.createOscillator();
    this.oscillator.type = "square";
    this.oscillator.connect(this.filterB);
    this.oscillator.start();
  }

  set filterFrequency(frequency) {
    const exponentialFrequency = exponentialValue(frequency, 32, 8000);
    this.filterA.frequency.value = exponentialFrequency;
    this.filterB.frequency.value = exponentialFrequency;
  }

  set filterResonance(resonance) {
    this.filterA.Q.value =
      this.filterAdefualtQ + exponentialValue(resonance, 0, 10);
    this.filterB.Q.value =
      this.filterBdefaultQ + exponentialValue(resonance, 0, 10);
  }

  set outputGain(gain) {
    this.output.gain.value = exponentialValue(gain);
  }

  noteOn(frequency, volume = 1.0) {
    this.amp.gain.cancelScheduledValues(this.context.currentTime);
    this.oscillator.frequency.value = frequency;
    // 0.1 is the maximum volume without overdrive
    // Time constant is attack
    this.amp.gain.setTargetAtTime(
      0.1 * volume,
      this.context.currentTime,
      0.001
    );
  }

  noteOff() {
    // Time constant is release
    this.amp.gain.setTargetAtTime(0, this.context.currentTime, 0.001);
  }
}
