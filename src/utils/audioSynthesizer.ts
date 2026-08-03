/**
 * Web Audio API Synthesizer for Citroën C4 Picasso UI
 * Generates realistic procedural audio effects without external files.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('citroen_sound_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('citroen_sound_muted', String(this.isMuted));
    } catch {}
    return this.isMuted;
  }

  private initCtx(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play UI click chime
   */
  public playClick() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  /**
   * Play car horn sound (Dual tone 440Hz + 550Hz)
   */
  public playHorn() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.35;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(415, now);
      osc2.frequency.setValueAtTime(518, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Low pass filter to make it sound like inside a car
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {}
  }

  /**
   * Central Locking Remote Beep (Lock/Unlock)
   */
  public playLockSound() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      // Beep 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1800, now);
      gain1.gain.setValueAtTime(0.09, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.06);

      // Beep 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2200, now + 0.09);
      gain2.gain.setValueAtTime(0.09, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.15);
    } catch {}
  }

  /**
   * Headlight Switch Click
   */
  public playSwitchSound() {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  /**
   * Realistic Citroën 1.6 HDi Engine Start & Idle Sound Effect
   */
  public playEngineStart(): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.initCtx();
      if (!ctx) {
        resolve();
        return;
      }

      try {
        const now = ctx.currentTime;

        // 1. Starter motor crank (high frequency pulses)
        const crankOsc = ctx.createOscillator();
        const crankGain = ctx.createGain();
        crankOsc.type = 'sawtooth';
        crankOsc.frequency.setValueAtTime(40, now);
        crankOsc.frequency.linearRampToValueAtTime(70, now + 0.5);

        crankGain.gain.setValueAtTime(0.08, now);
        crankGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        crankOsc.connect(crankGain);
        crankGain.connect(ctx.destination);
        crankOsc.start(now);
        crankOsc.stop(now + 0.55);

        // 2. Engine Firing & Diesel Engine Roar (Low frequency rumble)
        const engineOsc = ctx.createOscillator();
        const engineGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        engineOsc.type = 'sawtooth';
        
        // Engine RPM ramp up during ignition then settle to idle
        engineOsc.frequency.setValueAtTime(30, now + 0.5);
        engineOsc.frequency.exponentialRampToValueAtTime(180, now + 0.9); // Rev up
        engineOsc.frequency.exponentialRampToValueAtTime(85, now + 1.8);  // Settle idle

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now + 0.5);
        filter.frequency.exponentialRampToValueAtTime(900, now + 0.9);
        filter.frequency.exponentialRampToValueAtTime(350, now + 1.8);

        engineGain.gain.setValueAtTime(0, now + 0.45);
        engineGain.gain.linearRampToValueAtTime(0.2, now + 0.9);
        engineGain.gain.linearRampToValueAtTime(0.12, now + 1.8);
        engineGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

        engineOsc.connect(filter);
        filter.connect(engineGain);
        engineGain.connect(ctx.destination);

        engineOsc.start(now + 0.45);
        engineOsc.stop(now + 3.2);

        // 3. HDi Turbocharger Whistle (High sine slide)
        const turboOsc = ctx.createOscillator();
        const turboGain = ctx.createGain();

        turboOsc.type = 'sine';
        turboOsc.frequency.setValueAtTime(1200, now + 0.7);
        turboOsc.frequency.exponentialRampToValueAtTime(2800, now + 1.1);
        turboOsc.frequency.exponentialRampToValueAtTime(1500, now + 1.9);

        turboGain.gain.setValueAtTime(0, now + 0.7);
        turboGain.gain.linearRampToValueAtTime(0.04, now + 1.1);
        turboGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        turboOsc.connect(turboGain);
        turboGain.connect(ctx.destination);

        turboOsc.start(now + 0.7);
        turboOsc.stop(now + 2.5);

        setTimeout(() => {
          resolve();
        }, 3200);

      } catch {
        resolve();
      }
    });
  }
}

export const audioSynth = new AudioSynthesizer();
