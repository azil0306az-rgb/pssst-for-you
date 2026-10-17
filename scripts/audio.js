/**
 * PROCEDURAL WEB AUDIO SOUND ENGINE
 * "PSSST... THIS IS FOR YOU"
 * 
 * Uses Web Audio API synthesizers so it runs 100% offline, with zero network lag,
 * zero broken external links, and full mobile browser compatibility.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientInterval = null;
    this.ambientStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    
    if (!this.isMuted) {
      this.startAmbientMusic();
      this.playChime(587.33); // D5 welcome chime
    } else {
      this.stopAmbientMusic();
    }
    return !this.isMuted;
  }

  setMuted(muted) {
    this.init();
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopAmbientMusic();
    } else {
      this.startAmbientMusic();
    }
  }

  /**
   * Ambient Music Box: Plays gentle, heartwarming arpeggiated lullaby chords
   */
  startAmbientMusic() {
    if (this.ambientInterval || this.isMuted) return;
    
    // Warm, dreamy pentatonic / lydian scale frequencies (Hz)
    const melody = [
      523.25, 659.25, 783.99, 987.77, // C5, E5, G5, B5
      587.33, 739.99, 880.00, 1046.50, // D5, F#5, A5, C6
      440.00, 523.25, 659.25, 783.99, // A4, C5, E5, G5
      698.46, 880.00, 1046.50, 1318.51 // F5, A5, C6, E6
    ];

    this.ambientInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const note = melody[this.ambientStep % melody.length];
      this.playMusicBoxNote(note, 0.04);
      this.ambientStep++;
    }, 750);
  }

  stopAmbientMusic() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  playMusicBoxNote(freq, volume = 0.05) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.25);
    } catch (e) {
      console.warn("Audio note error:", e);
    }
  }

  // --- SOUND EFFECTS ---

  /** Soft magical chime */
  playChime(freq = 659.25) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {}
  }

  /** Gift Box opening sound: whoosh + sparkle chime chord */
  playGiftOpening() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 1.5);
      });
    } catch (e) {}
  }

  /** Confetti Pop: cheerful burst */
  playConfetti() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      
      // Noise burst for the "pop"
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);

      // High sparkle trail
      [1046.5, 1318.5, 1567.98].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + 0.04 + i * 0.05);
        g.gain.setValueAtTime(0.08, now + 0.04 + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5 + i * 0.05);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + 0.04 + i * 0.05);
        osc.stop(now + 0.6 + i * 0.05);
      });
    } catch (e) {}
  }

  /** Envelope opening: paper flutter & chime */
  playEnvelope() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.1, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7 + i * 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + 0.75 + i * 0.08);
      });
    } catch (e) {}
  }

  /** Trophy award fanfare */
  playAward() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.50, t: 0.4 }
      ];

      fanfare.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now + note.t);
        gain.gain.setValueAtTime(0.15, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.9);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + note.t);
        osc.stop(now + note.t + 0.95);
      });
    } catch (e) {}
  }

  /** Secret chest unlock */
  playUnlock() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Click
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(1200, now);
      gain1.gain.setValueAtTime(0.1, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.06);

      // Mystical sweep
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(392, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.5);
      gain2.gain.setValueAtTime(0.12, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.85);
    } catch (e) {}
  }

  /** Heart tap: scales pitch up slightly with tap count */
  playHeartTap(tapCount = 1) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const baseFreq = 440 + Math.min(tapCount * 45, 600);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  /** Wish Orb drone */
  playWishOrb() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 2.0);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.1);
    } catch (e) {}
  }

  /** Final Wish Granted cosmic blast */
  playWishGranted() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chord = [392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.6);
      });
    } catch (e) {}
  }
}

export const sound = new SoundEngine();

