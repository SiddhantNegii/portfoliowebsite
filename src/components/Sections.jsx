import { useState } from 'react';
import { sound } from '../sound.js';

const Chips = ({ items }) => (
  <div className="chips">
    {items.map((t) => <span className="chip" key={t}>{t}</span>)}
  </div>
);

const Links = ({ links }) => (
  <div className="row">
    {links.map(([t, href]) => (
      <a className="chip link" key={href} href={href} target="_blank" rel="noopener noreferrer">{t} ↗</a>
    ))}
  </div>
);

const Bullets = ({ items }) => <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>;

function Email({ address }) {
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard?.writeText(address).then(() => {
    sound.play('copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  });
  return (
    <div className="row">
      <a className="email" href={`mailto:${address}`}>{address}</a>
      <button className="copy" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

const isEmpty = (s) => s.chips && !s.chips.length && !s.p && !s.list && !s.items;

export function Sections({ sections }) {
  return sections.filter((s) => !isEmpty(s)).map((s, i) => (
    <section className="section" key={s.h ?? i}>
      {s.h && <h3>{s.h}</h3>}
      {s.p && <p>{s.p}</p>}
      {s.coin && <p className="coin">{s.coin}</p>}
      {s.stats && (
        <div className="stats">
          {s.stats.map(([n, l]) => <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>)}
        </div>
      )}
      {s.list && <Bullets items={s.list} />}
      {s.chips && <Chips items={s.chips} />}
      {s.more && <p className="more">…and a lot more</p>}
      {s.groups && Object.entries(s.groups).map(([g, items]) => (
        <div className="section" key={g}><h4>{g}</h4><Chips items={items} /></div>
      ))}
      {s.items?.map((it) => (
        <article className="item" key={it.t}>
          <div className="row">
            <strong>{it.t}</strong>
            {it.live && <span className="live">● live</span>}
          </div>
          <small>{it.s}</small>
          {it.links && <Links links={it.links} />}
          {it.list && <Bullets items={it.list} />}
        </article>
      ))}
      {s.email && <Email address={s.email} />}
      {s.links && <Links links={s.links} />}
    </section>
  ));
}
