'use client';
import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { FlowDiagram, HubDiagram, QuadDiagram } from './PropDiagrams';
import type { HomeData } from '@/lib/homepage';

type Pillar = HomeData['pillars']['items'][number];

const DIAGRAMS = {
  modernize: FlowDiagram,
  build: QuadDiagram,
  ai: HubDiagram,
} as const;

const ICON_PROPS = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;
const TAB_ICONS = {
  ai: (
    <svg {...ICON_PROPS}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" />
    </svg>
  ),
  build: (
    <svg {...ICON_PROPS}>
      <path d="M12 3l8 4.5-8 4.5-8-4.5z" />
      <path d="M4 12l8 4.5 8-4.5" />
      <path d="M4 16.5L12 21l8-4.5" />
    </svg>
  ),
  modernize: (
    <svg {...ICON_PROPS}>
      <path d="M20 11a8 8 0 0 0-14.3-4.6L4 8" />
      <path d="M4 3.5V8h4.5" />
      <path d="M4 13a8 8 0 0 0 14.3 4.6L20 16" />
      <path d="M20 20.5V16h-4.5" />
    </svg>
  ),
} as const;

const DWELL_MS = 4500; // how long each tab stays up before the next one takes over

export default function PropositionStack({ pillars }: { pillars: HomeData['pillars'] }) {
  const headRef = useReveal<HTMLDivElement>();
  const tabsRef = useReveal<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const items = pillars.items;
  const [reduced, setReduced] = useState(false);
  const auto = !reduced && items.length > 1;

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // only run the timer while the tabs are on screen
  useEffect(() => {
    const el = tabsRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [tabsRef]);

  const current = items[active] ?? items[0];
  if (!current) return null;
  const Diagram = DIAGRAMS[current.key];

  return (
    <section className="proposition" id="capabilities">
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <h2>{pillars.heading}</h2>
          {pillars.lede && <p className="lede">{pillars.lede}</p>}
        </div>
        <div ref={tabsRef} className="ptabs reveal" data-paused={auto && onScreen ? undefined : ''}>
          <div className="ptabs-list" role="tablist" aria-orientation="vertical">
            {items.map((p, i) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                id={`ptab-${p.key}`}
                aria-selected={i === active}
                aria-controls={`ppanel-${p.key}`}
                className={`ptab${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="ptab-icon">{TAB_ICONS[p.key]}</span>
                <span className="ptab-label">{p.title}</span>
                {i === active && auto && (
                  <span
                    key={active}
                    className="ptab-bar"
                    style={{ animationDuration: `${DWELL_MS}ms` }}
                    onAnimationEnd={() => setActive((a) => (a + 1) % items.length)}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="ppanel" role="tabpanel" id={`ppanel-${current.key}`} aria-labelledby={`ptab-${current.key}`}>
            <div key={current.key} className="ppanel-body">
              <div className="ppanel-text">
                <h3>{current.title}</h3>
                <p>{current.body}</p>
                {current.chips.length > 0 && (
                  <div className="chips">
                    {current.chips.map((c) => (
                      <span className="chip" key={c}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="prop-visual-wrap">
                <Diagram />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
