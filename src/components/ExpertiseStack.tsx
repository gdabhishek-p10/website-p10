'use client';
import { useEffect, useRef } from 'react';
import type { HomeData } from '@/lib/homepage';
import LabVideo from './LabVideo';

const THEMES = ['blue', 'green', 'pink', 'white'] as const; // card surfaces, the Get Hyped colours; the hero above is already white, so white comes last

// Expertise cards that stack: each card pins under the header and the next one slides over it.
// A card that is being covered by the next one tilts, shrinks and fades.
export default function ExpertiseStack({
  aiLabs,
  onPlay,
}: {
  aiLabs: HomeData['aiLabs'];
  onPlay: (video: string, poster: string) => void;
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;

    function update() {
      frame = 0;
      const items = itemRefs.current;
      items.forEach((item, i) => {
        const card = item?.firstElementChild as HTMLElement | null;
        const next = items[i + 1];
        if (!item || !card || !next) return; // the last card just scrolls away with the section
        const pinTop = parseFloat(getComputedStyle(item).top) || 0;
        const peek = parseFloat(getComputedStyle(next).top) - pinTop; // the sliver of this card left showing
        // how far along the exit is, 0 to 1: the next card covering this one
        const progress = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - pinTop - peek) / item.offsetHeight));
        card.style.transform = progress ? `scale(${1 - 0.12 * progress}) rotate(${2.5 * progress}deg)` : '';
        card.style.opacity = progress ? String(1 - 0.9 * progress) : '';
      });
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [aiLabs.entries.length]);

  return (
    <section className="expertise" id="labs-top" aria-labelledby="expertise-title">
      <div className="container">
        <h2 className="sr-only" id="expertise-title">
          P10 AI Lab
        </h2>
        <div className="exp-stack">
          {aiLabs.entries.map((d, i) => (
            <div
              className="exp-item"
              key={d.key}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              style={{ top: `calc(var(--exp-top) + ${i} * var(--exp-peek))`, zIndex: i + 1 }}
            >
              <article className={`exp-card exp-${THEMES[i % THEMES.length]}`}>
                <div className="exp-top">
                  <span className="exp-tag">P10 AI Lab</span>
                </div>
                <h3 className="exp-title">{d.name}</h3>
                <div className="exp-body">
                  <div className="exp-text">
                    <p>{d.copy}</p>
                    <div className="chips">
                      {d.chips.map((c) => (
                        <span className="chip" key={c}>
                          {c}
                        </span>
                      ))}
                    </div>
                    {d.url ? (
                      <a className="exp-link" href={d.url} target="_blank" rel="noopener">
                        Get demo <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <button type="button" className="exp-link" onClick={() => onPlay(d.video, d.poster)}>
                        Get demo <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </div>
                  <LabVideo src={d.video} poster={d.poster} label={`${d.name} demo video`} />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
