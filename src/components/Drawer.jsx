import { useEffect, useRef } from 'react';
import { ROOM } from '../content.js';
import { Sections } from './Sections.jsx';
import { ArcadeMenu } from './ArcadeMenu.jsx';

export function Drawer({ openKey, onClose, arcade }) {
  const closeRef = useRef(null);
  const bodyRef = useRef(null);
  const lastKey = useRef(openKey);
  if (openKey) lastKey.current = openKey;
  const data = ROOM[lastKey.current];

  useEffect(() => {
    if (!openKey) return undefined;
    bodyRef.current.scrollTop = 0;
    closeRef.current.focus({ preventScroll: true });
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openKey, onClose]);

  return (
    <aside
      className={`drawer${openKey ? ' open' : ''}${data?.arcade ? ' arcade' : ''}`}
      aria-hidden={!openKey}
      aria-labelledby="drawer-title"
      role="dialog"
    >
      <header>
        <div className="meta">
          <span className="eyebrow">{data?.eyebrow}</span>
          <h2 id="drawer-title">{data?.title}</h2>
        </div>
        <button ref={closeRef} className="close" type="button" aria-label="Close" onClick={onClose}>×</button>
      </header>
      <div className="body" ref={bodyRef}>
        {data?.arcade ? (
          <ArcadeMenu active={!!openKey} state={arcade.state} act={arcade.act} coin={data.sections.find((s) => s.coin)?.coin} />
        ) : (
          data && <Sections sections={data.sections} />
        )}
      </div>
    </aside>
  );
}
