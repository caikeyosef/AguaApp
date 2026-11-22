let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextCtor();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Short pleasant water droplet / rising bubble sound via Web Audio API.
 */
export function playDropletSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Primary droplet bloop (sine sweep upward)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(340, now);
  osc.frequency.exponentialRampToValueAtTime(760, now + 0.085);
  osc.frequency.exponentialRampToValueAtTime(590, now + 0.14);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.17);

  // Tiny secondary bubble pop
  const popOsc = ctx.createOscillator();
  const popGain = ctx.createGain();
  popOsc.type = 'sine';
  popOsc.frequency.setValueAtTime(680, now + 0.075);
  popOsc.frequency.exponentialRampToValueAtTime(1180, now + 0.13);

  popGain.gain.setValueAtTime(0.0001, now + 0.075);
  popGain.gain.linearRampToValueAtTime(0.09, now + 0.09);
  popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  popOsc.connect(popGain);
  popGain.connect(ctx.destination);
  popOsc.start(now + 0.075);
  popOsc.stop(now + 0.16);
}

/**
 * Celebratory warm arpeggiated chord when reaching 100% goal or unlocking a mascot.
 */
export function playCelebrationChord(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.075;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.68);
  });
}

/**
 * Subtle tactile tap feedback sound.
 */
export function playTapSound(enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(480, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.045);
}
