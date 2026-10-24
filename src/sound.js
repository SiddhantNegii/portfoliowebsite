// Every sound is synthesized with Web Audio, so there are no audio files to load.
let ctx = null;
let master = null;
let muted = false;
let noiseBuffer = null;
let unlocked = false;

// Browsers only allow audio after the visitor interacts, so stay silent until then.
const unlock = () => {
  unlocked = true;
  ctx?.resume();
};
window.addEventListener('pointerdown', unlock, { once: true });
window.addEventListener('keydown', unlock, { once: true });

function audio() {
  if (muted || !unlocked) return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ from, to = from, dur, type = 'sine', gain = 0.2, at = 0, attack = 0.005 }) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(env).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise({ dur, from, to = from, q = 1, gain = 0.2, at = 0, type = 'bandpass' }) {
  const c = audio();
  if (!c) return;
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const t = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + dur * 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(env).connect(master);
  src.start(t);
  src.stop(t + dur + 0.02);
}

function purr(dur = 1.6) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 26;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 220;
  const flutter = c.createOscillator();
  flutter.frequency.value = 2.2;
  const depth = c.createGain();
  depth.gain.value = 0.035;
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.07, t + 0.15);
  env.gain.setValueAtTime(0.07, t + dur - 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  flutter.connect(depth).connect(env.gain);
  osc.connect(filter).connect(env).connect(master);
  [osc, flutter].forEach((o) => { o.start(t); o.stop(t + dur + 0.05); });
}

// A cat voice: a buzzy source shaped by two moving formants, so it sweeps "mi-aa-ow".
// pitch is a list of [fraction of dur, Hz]; vowel is a list of [F1, F2] spread across dur.
function voice({ pitch, dur, gain = 0.5, vowel = [[350, 1900], [850, 1500], [500, 850]], trill = 0, breath = 0 }) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  pitch.forEach(([at, f], i) => (i ? osc.frequency.exponentialRampToValueAtTime(f, t + at * dur) : osc.frequency.setValueAtTime(f, t)));
  const vibrato = c.createOscillator();
  vibrato.frequency.value = 5.5;
  const vibratoDepth = c.createGain();
  vibratoDepth.gain.value = 9;
  vibrato.connect(vibratoDepth).connect(osc.frequency);

  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.06, dur * 0.2));
  env.gain.setValueAtTime(gain, t + dur * 0.7);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  const sources = [osc, vibrato];
  if (trill) {
    const flutter = c.createOscillator();
    flutter.frequency.value = trill;
    const flutterDepth = c.createGain();
    flutterDepth.gain.value = gain * 0.8;
    flutter.connect(flutterDepth).connect(env.gain);
    sources.push(flutter);
  }

  [0, 1].forEach((k) => {
    const formant = c.createBiquadFilter();
    formant.type = 'bandpass';
    formant.Q.value = k ? 7 : 4;
    vowel.forEach((v, i) => {
      const at = t + (dur * i) / Math.max(1, vowel.length - 1);
      if (i) formant.frequency.linearRampToValueAtTime(v[k], at);
      else formant.frequency.setValueAtTime(v[k], at);
    });
    const level = c.createGain();
    level.gain.value = k ? 0.7 : 1;
    osc.connect(formant).connect(level).connect(env);
  });
  env.connect(master);
  sources.forEach((o) => { o.start(t); o.stop(t + dur + 0.05); });
  if (breath) noise({ dur, from: 1800, to: 900, q: 0.7, gain: breath });
}

const cat = {
  meow: () => voice({ pitch: [[0, 470], [0.35, 720], [1, 400]], dur: 0.75, gain: 0.15 }),
  grabbed: () => voice({ pitch: [[0, 620], [0.55, 1080], [1, 880]], dur: 0.4, gain: 0.28, vowel: [[420, 1900], [950, 1650], [900, 1700]] }),
  chirp: () => voice({ pitch: [[0, 430], [1, 640]], dur: 0.3, gain: 0.25, trill: 24, vowel: [[300, 900], [650, 1400]] }),
  grumble: () => voice({ pitch: [[0, 380], [0.4, 470], [1, 290]], dur: 0.6, gain: 0.22, vowel: [[400, 1000], [750, 1200], [450, 800]] }),
  yawn: () => voice({ pitch: [[0, 640], [0.3, 560], [1, 230]], dur: 1.3, gain: 0.2, vowel: [[700, 1700], [950, 1300], [420, 780]], breath: 0.05 }),
  snore: () => noise({ dur: 1.1, from: 260, to: 620, q: 1.2, gain: 0.22, type: 'lowpass' }),
};

const SOUNDS = {
  hover: () => tone({ from: 1400, to: 1800, dur: 0.05, gain: 0.04 }),
  open: () => noise({ dur: 0.5, from: 400, to: 2600, q: 0.8, gain: 0.08 }),
  close: () => noise({ dur: 0.4, from: 2200, to: 300, q: 0.8, gain: 0.06 }),
  lampOn: () => { noise({ dur: 0.04, from: 3000, gain: 0.15, type: 'highpass' }); tone({ from: 140, to: 90, dur: 0.08, gain: 0.15 }); },
  lampOff: () => { noise({ dur: 0.04, from: 2400, gain: 0.12, type: 'highpass' }); tone({ from: 110, to: 70, dur: 0.08, gain: 0.12 }); },
  enter: () => [196, 247, 294, 392].forEach((f, i) => tone({ from: f, dur: 0.6, type: 'triangle', gain: 0.07, at: i * 0.07, attack: 0.04 })),
  pet: () => { cat.chirp(); purr(); },
  pickup: cat.grabbed,
  drop: () => { tone({ from: 160, to: 60, dur: 0.12, gain: 0.25 }); noise({ dur: 0.08, from: 600, gain: 0.08, type: 'lowpass' }); },
  landed: cat.grumble,
  meow: cat.meow,
  yawn: cat.yawn,
  snore: cat.snore,
  up: () => tone({ from: 660, dur: 0.06, type: 'square', gain: 0.05 }),
  down: () => tone({ from: 520, dur: 0.06, type: 'square', gain: 0.05 }),
  select: () => { tone({ from: 988, dur: 0.08, type: 'square', gain: 0.06 }); tone({ from: 1319, dur: 0.3, type: 'square', gain: 0.06, at: 0.08 }); },
  back: () => { tone({ from: 660, dur: 0.07, type: 'square', gain: 0.05 }); tone({ from: 440, dur: 0.12, type: 'square', gain: 0.05, at: 0.07 }); },
  copy: () => { tone({ from: 1320, dur: 0.12, gain: 0.1 }); tone({ from: 1760, dur: 0.25, gain: 0.1, at: 0.09 }); },
};

export const sound = {
  play: (name) => SOUNDS[name]?.(),
  setMuted: (value) => {
    muted = value;
    if (muted && ctx) ctx.suspend();
  },
};
