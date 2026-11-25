'use client';
import { useRef, useState } from 'react';
import type { HomeData } from '@/lib/homepage';
import LabVideo from './LabVideo';

type Lab = HomeData['aiLabs']['entries'][number];

// One video card with its title beneath it. It rests on the video's first frame; while it is paused the pointer turns into a round play button that
// follows it around the card (nothing is drawn on the card otherwise), and the usual controls show along the bottom on hover.
function BentoCard({ lab, main }: { lab: Lab; main: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  function move(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--cx', `${e.clientX - r.left}px`);
    el.style.setProperty('--cy', `${e.clientY - r.top}px`);
    // over the control bar the normal cursor comes back
    el.dataset.ctl = (e.target as HTMLElement).closest('.exp-controls') ? '1' : '';
  }

  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty('--cx');
    el.style.removeProperty('--cy');
    el.dataset.ctl = '';
  }

  return (
    <figure className={`bento-item${main ? ' bento-main' : ''}`}>
      <article ref={ref} className={`bento-tile${playing ? '' : ' is-paused'}`} onPointerMove={move} onPointerLeave={leave}>
        <LabVideo src={lab.video} poster={lab.poster} label={`${lab.name} demo video`} autoPlay={false} onPlayingChange={setPlaying} />
        <span className="bento-cursor" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
            <path d="M8.5 6v12l10-6z" />
          </svg>
        </span>
      </article>
      <figcaption className="bento-title">{lab.name}</figcaption>
    </figure>
  );
}

// The AI lab demos as a bento of video cards: the first one large, the next two stacked beside it, and the same
// "Explore more" button as option 1 after them.
export default function LabsBento({ aiLabs, onExplore }: { aiLabs: HomeData['aiLabs']; onExplore: () => void }) {
  const [main, ...rest] = aiLabs.entries;
  if (!main) return null;
  const side = rest.slice(0, 2);

  return (
    <section className="bento" id="labs-top" aria-label={aiLabs.heading}>
      <div className="bento-outer">
        <div className="bento-grid">
          <BentoCard lab={main} main />
          {side.map((d) => (
            <BentoCard key={d.key} lab={d} main={false} />
          ))}
        </div>
        <div className="bento-foot">
          <span>{aiLabs.heading}</span>
          <span>{aiLabs.lede}</span>
        </div>
        <div className="bento-more">
          <button type="button" className="btn lab-stack-cta" onClick={onExplore}>
            Explore more <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
