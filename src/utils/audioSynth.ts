// Web Audio API procedural ambient noise engine & sound effects generator
// 100% royalty-free, offline-ready, non-looping procedural audio

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundNodes: Map<string, { gain: GainNode; stop: () => void }> = new Map();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(volume: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public setTrackVolume(id: string, volume: number) {
    const node = this.soundNodes.get(id);
    if (node && this.ctx) {
      node.gain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public playChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    // Tibetan meditation bowl harmonized tone
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now); // 528Hz Solfeggio frequency
    osc1.frequency.exponentialRampToValueAtTime(520, now + 4);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1056, now); // Octave overtone
    osc2.frequency.exponentialRampToValueAtTime(1040, now + 3);

    chimeGain.gain.setValueAtTime(0.001, now);
    chimeGain.gain.linearRampToValueAtTime(0.4, now + 0.08);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    osc1.connect(chimeGain);
    osc2.connect(chimeGain);
    chimeGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 4.5);
    osc2.stop(now + 4.5);
  }

  public startSound(id: string, volume: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.soundNodes.has(id)) {
      this.setTrackVolume(id, volume);
      return;
    }

    const trackGain = this.ctx.createGain();
    trackGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    trackGain.connect(this.masterGain);

    let stopFn: () => void = () => {};

    switch (id) {
      case 'rain':
        stopFn = this.createRain(trackGain);
        break;
      case 'thunder':
        stopFn = this.createThunder(trackGain);
        break;
      case 'campfire':
        stopFn = this.createCampfire(trackGain);
        break;
      case 'wind':
        stopFn = this.createWind(trackGain);
        break;
      case 'waves':
        stopFn = this.createWaves(trackGain);
        break;
      case 'coffee':
        stopFn = this.createCoffeeShop(trackGain);
        break;
      case 'keyboard':
        stopFn = this.createKeyboard(trackGain);
        break;
      case 'stream':
        stopFn = this.createStream(trackGain);
        break;
      case 'birds':
        stopFn = this.createBirds(trackGain);
        break;
      case 'whitenoise':
      default:
        stopFn = this.createPinkNoise(trackGain);
        break;
    }

    this.soundNodes.set(id, { gain: trackGain, stop: stopFn });
  }

  public stopSound(id: string) {
    const node = this.soundNodes.get(id);
    if (node) {
      node.stop();
      this.soundNodes.delete(id);
    }
  }

  public stopAll() {
    for (const [id] of this.soundNodes) {
      this.stopSound(id);
    }
  }

  // --- Procedural Synthesizers ---

  private createPinkNoise(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    whiteNoise.connect(filter);
    filter.connect(dest);
    whiteNoise.start();

    return () => {
      try { whiteNoise.stop(); whiteNoise.disconnect(); } catch {}
    };
  }

  private createRain(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.8;

    source.connect(filter);
    filter.connect(dest);
    source.start();

    return () => {
      try { source.stop(); source.disconnect(); } catch {}
    };
  }

  private createWind(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    // Slow LFO for wind gust swelling
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.2;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(dest);
    source.start();
    lfo.start();

    return () => {
      try { source.stop(); lfo.stop(); source.disconnect(); lfo.disconnect(); } catch {}
    };
  }

  private createWaves(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.12; // Ocean wave rhythmic swell
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(dest);
    source.start();
    lfo.start();

    return () => {
      try { source.stop(); lfo.stop(); source.disconnect(); lfo.disconnect(); } catch {}
    };
  }

  private createCampfire(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    // Base low rumble
    const rumble = this.ctx.createBufferSource();
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    rumble.buffer = buffer;
    rumble.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;
    rumble.connect(filter);
    filter.connect(dest);
    rumble.start();

    // Crackle generator interval
    let isRunning = true;
    const triggerCrackle = () => {
      if (!isRunning || !this.ctx) return;
      const crackleOsc = this.ctx.createOscillator();
      const crackleGain = this.ctx.createGain();
      crackleOsc.type = 'triangle';
      crackleOsc.frequency.setValueAtTime(1200 + Math.random() * 2500, this.ctx.currentTime);
      crackleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      crackleGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      crackleOsc.connect(crackleGain);
      crackleGain.connect(dest);
      crackleOsc.start();
      crackleOsc.stop(this.ctx.currentTime + 0.05);

      setTimeout(triggerCrackle, 50 + Math.random() * 300);
    };
    triggerCrackle();

    return () => {
      isRunning = false;
      try { rumble.stop(); rumble.disconnect(); } catch {}
    };
  }

  private createThunder(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    let isRunning = true;

    const rollThunder = () => {
      if (!isRunning || !this.ctx) return;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 4, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 120;

      const g = this.ctx.createGain();
      const now = this.ctx.currentTime;
      g.gain.setValueAtTime(0.01, now);
      g.gain.linearRampToValueAtTime(0.7, now + 0.6);
      g.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      source.connect(filter);
      filter.connect(g);
      g.connect(dest);
      source.start(now);
      source.stop(now + 4);

      setTimeout(rollThunder, 8000 + Math.random() * 12000);
    };

    rollThunder();
    return () => { isRunning = false; };
  }

  private createKeyboard(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    let isRunning = true;

    const click = () => {
      if (!isRunning || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 800, this.ctx.currentTime);
      g.gain.setValueAtTime(0.12, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(g);
      g.connect(dest);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);

      // Typing rhythm
      const delays = [120, 160, 200, 350, 600, 150];
      const nextDelay = delays[Math.floor(Math.random() * delays.length)];
      setTimeout(click, nextDelay);
    };
    click();
    return () => { isRunning = false; };
  }

  private createStream(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 1.2;

    source.connect(filter);
    filter.connect(dest);
    source.start();

    return () => {
      try { source.stop(); source.disconnect(); } catch {}
    };
  }

  private createCoffeeShop(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    // Warm background murmur with low hum
    const murmur = this.ctx.createBufferSource();
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    murmur.buffer = buffer;
    murmur.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 1.5;

    murmur.connect(filter);
    filter.connect(dest);
    murmur.start();

    return () => {
      try { murmur.stop(); murmur.disconnect(); } catch {}
    };
  }

  private createBirds(dest: GainNode): () => void {
    if (!this.ctx) return () => {};
    let isRunning = true;

    const chirp = () => {
      if (!isRunning || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      const baseFreq = 2800 + Math.random() * 1000;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.16);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.08, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(g);
      g.connect(dest);
      osc.start(now);
      osc.stop(now + 0.22);

      setTimeout(chirp, 2500 + Math.random() * 5000);
    };

    chirp();
    return () => { isRunning = false; };
  }
}

export const audioEngine = new AudioEngine();

