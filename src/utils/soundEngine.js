/**
 * ASTRANUMERICS - WEB AUDIO SOLFEGGIO SYNTHESIZER
 * Pure Web Audio API ambient generator (432Hz harmonic drone & celestial chimes).
 */

let audioCtx = null;
let droneOsc1 = null;
let droneOsc2 = null;
let droneGain = null;
let isAudioEnabled = false;

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
  const ctx = getAudioContext();
  if (!ctx) return false;

  isAudioEnabled = !isAudioEnabled;

  if (isAudioEnabled) {
    startAmbientDrone();
    playChime(528); // Transformation frequency chime
  } else {
    stopAmbientDrone();
  }

  return isAudioEnabled;
}

export function getAudioState() {
  return isAudioEnabled;
}

export function startAmbientDrone() {
  const ctx = getAudioContext();
  if (!ctx || !isAudioEnabled) return;

  if (droneGain) return; // Already playing

  try {
    droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 3);

    // 432Hz Fundamental & 216Hz Sub-harmonic
    droneOsc1 = ctx.createOscillator();
    droneOsc1.type = 'sine';
    droneOsc1.frequency.setValueAtTime(216, ctx.currentTime);

    droneOsc2 = ctx.createOscillator();
    droneOsc2.type = 'triangle';
    droneOsc2.frequency.setValueAtTime(432, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(ctx.destination);

    droneOsc1.start();
    droneOsc2.start();
  } catch (err) {
    console.warn('[AudioEngine] Drone start failed:', err);
  }
}

export function stopAmbientDrone() {
  if (!audioCtx || !droneGain) return;
  try {
    droneGain.gain.setValueAtTime(droneGain.gain.value, audioCtx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
    setTimeout(() => {
      if (droneOsc1) { droneOsc1.stop(); droneOsc1.disconnect(); droneOsc1 = null; }
      if (droneOsc2) { droneOsc2.stop(); droneOsc2.disconnect(); droneOsc2 = null; }
      if (droneGain) { droneGain.disconnect(); droneGain = null; }
    }, 1500);
  } catch (err) {
    console.warn('[AudioEngine] Drone stop failed:', err);
  }
}

export function playChime(freq = 528) {
  if (!isAudioEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.8);
  } catch (err) {
    // Silence audio errors
  }
}
