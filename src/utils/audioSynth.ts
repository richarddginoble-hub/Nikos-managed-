// Web Audio harmonic synthesizer for playing authentic acoustic bouzouki & laiko melody previews
class BouzoukiAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTimeout: any = null;
  private onStateChange: ((playing: boolean) => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setListener(fn: (playing: boolean) => void) {
    this.onStateChange = fn;
  }

  // Play a characteristic Mediterranean/Greek bouzouki melodic phrase based on song type
  public playMelody(type: 'bouzouki_laiko' | 'romantic_ballad' | 'uptempo_anthem' = 'bouzouki_laiko', onEnd?: () => void) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    if (this.onStateChange) this.onStateChange(true);

    // Notes mapping frequencies (Hz) - D minor harmonic / Hijaz / Nikriz characteristic Greek dromoi
    const notes: Record<string, number> = {
      'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00,
      'Bb3': 233.08, 'C#4': 277.18, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
      'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'C#5': 554.37, 'D5': 587.33,
      'E5': 659.25, 'F5': 698.46
    };

    let sequence: { note: string; dur: number; tremolo?: boolean }[] = [];

    if (type === 'romantic_ballad') {
      // "An Eisai Ena Asteri" style gentle acoustic progression
      sequence = [
        { note: 'D4', dur: 0.5, tremolo: true },
        { note: 'F4', dur: 0.3 },
        { note: 'A4', dur: 0.6, tremolo: true },
        { note: 'G4', dur: 0.4 },
        { note: 'F4', dur: 0.3 },
        { note: 'E4', dur: 0.5, tremolo: true },
        { note: 'D4', dur: 0.3 },
        { note: 'C#4', dur: 0.6, tremolo: true },
        { note: 'D4', dur: 0.8, tremolo: true },
        { note: 'A4', dur: 0.5 },
        { note: 'Bb4', dur: 0.4 },
        { note: 'A4', dur: 0.5, tremolo: true },
        { note: 'G4', dur: 0.4 },
        { note: 'F4', dur: 0.5 },
        { note: 'E4', dur: 0.4 },
        { note: 'D4', dur: 1.0, tremolo: true },
      ];
    } else if (type === 'uptempo_anthem') {
      // "Thelo Na Me Nioseis" soaring dramatic crescendo
      sequence = [
        { note: 'A3', dur: 0.25 },
        { note: 'D4', dur: 0.35, tremolo: true },
        { note: 'E4', dur: 0.25 },
        { note: 'F4', dur: 0.4, tremolo: true },
        { note: 'G4', dur: 0.25 },
        { note: 'A4', dur: 0.6, tremolo: true },
        { note: 'Bb4', dur: 0.3 },
        { note: 'A4', dur: 0.35 },
        { note: 'G4', dur: 0.3 },
        { note: 'F4', dur: 0.4, tremolo: true },
        { note: 'E4', dur: 0.3 },
        { note: 'D4', dur: 0.5, tremolo: true },
        { note: 'C#4', dur: 0.4 },
        { note: 'D4', dur: 0.9, tremolo: true }
      ];
    } else {
      // "Pes To Mou Xana" lively laiko bouzouki tremolo
      sequence = [
        { note: 'D4', dur: 0.2, tremolo: true },
        { note: 'F4', dur: 0.2 },
        { note: 'G4', dur: 0.2 },
        { note: 'A4', dur: 0.4, tremolo: true },
        { note: 'Bb4', dur: 0.2 },
        { note: 'C#5', dur: 0.3, tremolo: true },
        { note: 'D5', dur: 0.6, tremolo: true },
        { note: 'C#5', dur: 0.2 },
        { note: 'Bb4', dur: 0.2 },
        { note: 'A4', dur: 0.4, tremolo: true },
        { note: 'G4', dur: 0.25 },
        { note: 'F4', dur: 0.3 },
        { note: 'E4', dur: 0.35 },
        { note: 'D4', dur: 0.8, tremolo: true }
      ];
    }

    let currentTime = this.ctx.currentTime + 0.05;

    sequence.forEach((step) => {
      const freq = notes[step.note] || 293.66;
      this.scheduleBouzoukiPluck(freq, currentTime, step.dur, step.tremolo);
      currentTime += step.dur;
    });

    const totalDuration = (currentTime - this.ctx.currentTime) * 1000;
    this.currentTimeout = setTimeout(() => {
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    }, totalDuration);
  }

  private scheduleBouzoukiPluck(freq: number, startTime: number, duration: number, tremolo = false) {
    if (!this.ctx) return;

    // Double string pairing characteristic of the 3-string & 4-string Greek Bouzouki (pairs tuned in unisons/octaves)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Bouzouki has a metallic bright pluck with fast attack and sustained resonance
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, startTime);
    // Slight detune for authentic chorused double-string shimmer
    osc2.frequency.setValueAtTime(freq * 1.0025, startTime);

    // Filter shaping for warm Mediterranean acoustic timbre
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, startTime);
    filter.frequency.exponentialRampToValueAtTime(1100, startTime + duration);

    // Amplitude envelope
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.22, startTime + 0.015);

    if (tremolo) {
      // Rapid bouzouki pick alternation
      const tremoloOsc = this.ctx.createOscillator();
      const tremoloGain = this.ctx.createGain();
      tremoloOsc.frequency.setValueAtTime(11, startTime); // 11Hz tremolo
      tremoloGain.gain.setValueAtTime(0.08, startTime);

      tremoloOsc.connect(gainNode.gain);
      tremoloOsc.start(startTime);
      tremoloOsc.stop(startTime + duration);
    }

    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }

  public stop() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.isPlaying = false;
    if (this.onStateChange) this.onStateChange(false);
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.suspend();
      } catch (e) {
        // ignore
      }
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const bouzoukiEngine = new BouzoukiAudioEngine();
