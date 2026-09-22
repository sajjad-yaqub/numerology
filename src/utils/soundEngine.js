/**
 * ASTRANUMERICS - METALLIC CHIME & GONG SOUND SYNTHESIZER
 * Pure Web Audio API engine providing soft metallic chimes, low gong tones, and dull thuds.
 * Ambient hum ONLY on idle state!
 */

let audioCtx = null;
let humOsc = null;
let humGain = null;
let isAudioEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleAudio() {
  getAudioContext();
  isAudioEnabled = !isAudioEnabled;
  if (isAudioEnabled) {
    playConfirmChime();
  } else {
    stopIdleHum();
  }
  return isAudioEnabled;
}

export function getAudioState() {
  return isAudioEnabled;
}

/**
 * Soft metallic chime tap (60ms) on hover
 */
export function playChimeTap() {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1470, ctx.currentTime); // Metallic frequency

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {}
}

/**
 * Low resonant metallic chime on confirm/button press
 */
export function playConfirmChime() {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(432, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(864, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (err) {}
}

/**
 * Short dull thud on error or invalid input
 */
export function playErrorThud() {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch (err) {}
}

/**
 * Rising bell arpeggio on success calculation (~250ms)
 */
export function playSuccessArpeggio() {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [528, 660, 792, 1056]; // Solfeggio bell frequencies
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.12);
    });
  } catch (err) {}
}

/**
 * Full resonant strike gong sting (800ms) on milestone / complete reading
 */
export function playMilestoneGong() {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(216, ctx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(432, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.85);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.85);
    osc2.stop(ctx.currentTime + 0.85);
  } catch (err) {}
}

/**
 * Idle state low hum (starts only on idle, stops during active reading)
 */
export function startIdleHum() {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx || humGain) return;

  try {
    humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.001, ctx.currentTime);
    humGain.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 2);

    humOsc = ctx.createOscillator();
    humOsc.type = 'sine';
    humOsc.frequency.setValueAtTime(108, ctx.currentTime);

    humOsc.connect(humGain);
    humGain.connect(ctx.destination);

    humOsc.start();
  } catch (err) {}
}

export function stopIdleHum() {
  if (!audioCtx || !humGain) return;
  try {
    humGain.gain.setValueAtTime(humGain.gain.value, audioCtx.currentTime);
    humGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      if (humOsc) { humOsc.stop(); humOsc.disconnect(); humOsc = null; }
      if (humGain) { humGain.disconnect(); humGain = null; }
    }, 500);
  } catch (err) {}
}
