import { PROFILE, ROOM, ROOM_ORDER } from '../content.js';
import { Sections } from './Sections.jsx';

export function ListView({ onBack }) {
  return (
    <main className="list-view">
      <header className="list-head">
        <span className="eyebrow">{PROFILE.tagline}</span>
        <h1>{PROFILE.name}</h1>
        <p className="lede">{PROFILE.headline}</p>
        {onBack && <button className="pill" type="button" onClick={onBack}>← Back to the room</button>}
      </header>
      {ROOM_ORDER.map((key) => {
        const room = ROOM[key];
        return (
          <section key={key} className={`card${room.arcade ? ' arcade' : ''}`} aria-labelledby={`list-${key}`}>
            <span className="eyebrow">{room.eyebrow}</span>
            <h2 id={`list-${key}`}>{room.title}</h2>
            <Sections sections={room.sections} />
          </section>
        );
      })}
    </main>
  );
}
