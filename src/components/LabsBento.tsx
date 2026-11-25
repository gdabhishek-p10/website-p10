'use client';
import type { HomeData } from '@/lib/homepage';

type Lab = HomeData['aiLabs']['entries'][number];

// One card: the video and its title inside a black outline. The video rests on its own first frame (nothing autoplays); while the
// pointer is over it, it turns into a round play button that follows it around, and a click opens the video in the pop-up player.
function BentoCard({ lab, main = false, onPlay }: { lab: Lab; main?: boolean; onPlay: (video: string, poster: string) => void }) {
  function move(e: React.PointerEvent<HTMLElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--cx', `${e.clientX - r.left}px`);
    el.style.setProperty('--cy', `${e.clientY - r.top}px`);
  }

  function leave(e: React.PointerEvent<HTMLElement>) {
    e.currentTarget.style.removeProperty('--cx');
    e.currentTarget.style.removeProperty('--cy');
  }

  return (
    <figure className={`bento-item${main ? ' bento-main' : ''}`}>
      <button type="button" className="bento-tile" aria-label={`Play video: ${lab.name}`} onClick={() => onPlay(lab.video, lab.poster)} onPointerMove={move} onPointerLeave={leave}>
        <video src={`${lab.video}#t=0.001`} muted playsInline preload="metadata" tabIndex={-1} />
        <span className="bento-cursor" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
            <path d="M8.5 6v12l10-6z" />
          </svg>
        </span>
      </button>
      <figcaption className="bento-title">{lab.name}</figcaption>
    </figure>
  );
}

// The AI lab demos as a bento of cards: the first one large, the next two stacked beside it (close in size, the large one
// only a little wider), and the same "Explore more" button as option 1 close below them.
export default function LabsBento({
  aiLabs,
  onPlay,
  onExplore,
}: {
  aiLabs: HomeData['aiLabs'];
  onPlay: (video: string, poster: string) => void;
  onExplore: () => void;
}) {
  const [main, ...rest] = aiLabs.entries;
  if (!main) return null;
  const side = rest.slice(0, 2);

  return (
    <section className="bento" id="labs-top" aria-label={aiLabs.heading}>
      <div className="bento-outer">
        <div className="bento-grid">
          <BentoCard lab={main} main onPlay={onPlay} />
          {side.map((d) => (
            <BentoCard key={d.key} lab={d} onPlay={onPlay} />
          ))}
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
