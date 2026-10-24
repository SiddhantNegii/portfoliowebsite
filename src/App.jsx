import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { EXTRAS, PROFILE, ROOM, ROOM_ORDER } from './content.js';
import { Room } from './scene/Room.js';
import { Drawer } from './components/Drawer.jsx';
import { ListView } from './components/ListView.jsx';
import { ARCADE_START, arcadeReducer } from './arcade.js';
import { sound } from './sound.js';

const ARCADE_SOUNDS = { up: 'up', down: 'down', enter: 'select', pick: 'select', back: 'back' };

const FONTS = ['40px "Press Start 2P"', '600 36px "JetBrains Mono"', '800 36px "JetBrains Mono"', '800 96px "Bricolage Grotesque"'];
const hasWebGL = (() => {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
})();

const storage = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

export default function App() {
  const [night, setNight] = useState(() => storage.get('theme') !== 'day');
  const [view, setView] = useState(hasWebGL ? 'room' : 'list');
  const [entered, setEntered] = useState(false);
  const [openKey, setOpenKey] = useState(null);
  const [tip, setTip] = useState(null);
  const [muted, setMuted] = useState(() => storage.get('sound') === 'off');
  const [arcade, dispatchArcade] = useReducer(arcadeReducer, ARCADE_START);
  const stageRef = useRef(null);
  const roomRef = useRef(null);
  const nightRef = useRef(night);

  const toggleNight = useCallback(() => {
    sound.play(nightRef.current ? 'lampOn' : 'lampOff');
    setNight((n) => !n);
  }, []);
  const actArcade = useCallback((action) => {
    const a = typeof action === 'string' ? { type: action } : action;
    dispatchArcade(a);
    sound.play(ARCADE_SOUNDS[a.type]);
    roomRef.current?.arcadeInput(a.type);
  }, []);

  useEffect(() => {
    sound.setMuted(muted);
    storage.set('sound', muted ? 'off' : 'on');
  }, [muted]);

  useEffect(() => {
    roomRef.current?.setArcade(arcade);
  }, [arcade]);

  useEffect(() => {
    nightRef.current = night;
    document.documentElement.dataset.theme = night ? 'night' : 'day';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', night ? '#1d1b26' : '#dcdbe0');
    storage.set('theme', night ? 'night' : 'day');
    roomRef.current?.setNight(night);
  }, [night]);

  useEffect(() => {
    if (view !== 'room') return undefined;
    let room;
    let cancelled = false;
    Promise.all(FONTS.map((f) => document.fonts?.load(f))).catch(() => {}).then(() => {
      if (cancelled) return;
      room = new Room(stageRef.current, {
        night: nightRef.current,
        onHover: (key, x, y) => {
          if (!key) return setTip(null);
          const label = ROOM[key]?.label ?? (key === 'cat' ? EXTRAS.cat : nightRef.current ? EXTRAS.lampNight : EXTRAS.lampDay);
          setTip({ key, label, x, y });
        },
        onSelect: setOpenKey,
        onArcade: actArcade,
        onLamp: () => {
          setTip(null);
          toggleNight();
        },
      });
      roomRef.current = room;
    });
    return () => {
      cancelled = true;
      room?.dispose();
      roomRef.current = null;
    };
  }, [view, toggleNight, actArcade]);

  const open = (key) => {
    setEntered(true);
    if (roomRef.current) roomRef.current.focus(key);
    else setOpenKey(key);
  };
  const close = useCallback(() => {
    setOpenKey(null);
    dispatchArcade({ type: 'reset' });
    roomRef.current?.release();
  }, []);

  const lampButton = (
    <button className="pill lamp" type="button" onClick={toggleNight} aria-pressed={night}>
      {night ? '☀ Lights on' : '☾ Lights off'}
    </button>
  );
  const soundButton = (
    <button className="pill" type="button" onClick={() => setMuted((m) => !m)} aria-pressed={!muted} aria-label="Sound">
      {muted ? '♪ Sound off' : '♪ Sound on'}
    </button>
  );

  if (view === 'list') {
    return (
      <>
        <div className="corner">{lampButton}{soundButton}</div>
        <ListView onBack={hasWebGL ? () => setView('room') : null} />
      </>
    );
  }

  return (
    <>
      <div className={`stage${openKey ? ' reading' : ''}`} ref={stageRef}>
        <header className="hud-top">
          <div className="brand">
            <h1>{PROFILE.name}</h1>
            <p>{PROFILE.headline} <span>· {PROFILE.tagline}</span></p>
          </div>
          <div className="controls">
            {lampButton}
            {soundButton}
            <button className="pill" type="button" onClick={() => { close(); setView('list'); }}>≡ List view</button>
          </div>
        </header>

        <nav className="jump" aria-label="Jump to an object">
          {ROOM_ORDER.map((key) => (
            <button key={key} type="button" onClick={() => open(key)}>{ROOM[key].jump}</button>
          ))}
        </nav>

        <p className="hint" aria-hidden="true">Drag to look around · click things · the lamp is a light switch · pet the cat</p>

        <div className={`boot${entered ? ' gone' : ''}`}>
          <div className="box">
            <p>{PROFILE.name} · {PROFILE.headline}</p>
            <p className="caret">Click to enter the room</p>
            <button type="button" onClick={() => { setEntered(true); sound.play('enter'); }}>ENTER</button>
          </div>
        </div>
      </div>

      {tip && (
        <div key={tip.key} className="tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">{tip.label}</div>
      )}
      <Drawer openKey={openKey} onClose={close} arcade={{ state: arcade, act: actArcade }} />
    </>
  );
}
