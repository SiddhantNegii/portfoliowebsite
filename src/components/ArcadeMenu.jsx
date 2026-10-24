import { useEffect, useRef } from 'react';
import { ARCADE_CHANNELS } from '../content.js';
import { ARCADE_KEYS } from '../arcade.js';

export function ArcadeMenu({ active, state, act, coin }) {
  const listRef = useRef(null);
  const { mode, channel, index } = state;
  const current = ARCADE_CHANNELS[channel];

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const type = e.key === 'Escape' ? (mode === 'list' ? 'back' : null) : ARCADE_KEYS[e.key];
      if (!type) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      act(type);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active, act, mode]);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [mode, channel, index]);

  const row = (label, selected, onClick, extra) => (
    <li key={label} role="option" aria-selected={selected}>
      <button type="button" className={selected ? 'on' : ''} onClick={onClick}>
        <span className="cursor">{selected ? '>' : ' '}</span>
        <span className="label">{label}</span>
        {extra && <span className="count">{extra}</span>}
      </button>
    </li>
  );

  return (
    <div className="arcade-menu">
      <div className="screen">
        {mode === 'menu' ? (
          <>
            <h3>SELECT CHANNEL</h3>
            <ul role="listbox" aria-label="Channels" ref={listRef}>
              {ARCADE_CHANNELS.map((c, i) => row(c.name, i === channel, () => act({ type: 'pick', index: i }), c.items.length))}
            </ul>
          </>
        ) : (
          <>
            <h3>{current.name} <span className="count">{Math.min(index + 1, current.items.length)}/{current.items.length}</span></h3>
            <ul role="listbox" aria-label={current.name} ref={listRef}>
              {current.items.map((t, i) => row(t, i === index, () => act({ type: 'pick', index: i })))}
              {current.more && <li className="more" aria-hidden="true">…AND A LOT MORE</li>}
              {row('< BACK', index === current.items.length, () => act('back'))}
            </ul>
          </>
        )}
      </div>

      <div className="pad">
        <div className="dpad">
          <button type="button" aria-label="Up" onClick={() => act('up')}>▲</button>
          <button type="button" aria-label="Down" onClick={() => act('down')}>▼</button>
        </div>
        <div className="abtn">
          <button type="button" className="a" onClick={() => act('enter')}>A</button>
          <button type="button" className="b" onClick={() => act('back')}>B</button>
        </div>
      </div>
      <p className="keys">↑↓ MOVE · ENTER / A SELECT · ESC / B BACK</p>
      {coin && <p className="coin">{coin}</p>}
    </div>
  );
}
