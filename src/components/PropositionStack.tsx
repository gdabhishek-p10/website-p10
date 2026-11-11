'use client';
import { useEffect, useRef } from 'react';
import Reveal from './Reveal';
import type { HomeData } from '@/lib/homepage';

const IMAGES = {
  ai: {
    src: '/ai-execution/ai-orchestration-v2.webp',
    alt: 'Connected architectural walkways linking a contemporary atrium, representing coordinated AI execution',
  },
  build: {
    src: '/ai-execution/product-build-v2.webp',
    alt: 'Interlocking contemporary building volumes in stone, blue glass and gold, representing product creation',
  },
  modernize: {
    src: '/ai-execution/modernization-v2.webp',
    alt: 'Historic stone architecture joined to a modern glass extension, representing modernization without starting over',
  },
} as const;

export default function PropositionStack({ pillars }: { pillars: HomeData['pillars'] }) {
  const timelineRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const rows = Array.from(timeline.querySelectorAll<HTMLElement>('.execution-stage'));
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const midpoint = window.innerHeight * 0.5;
      for (const row of rows) {
        const rect = row.getBoundingClientRect();
        const progress = preference.matches ? 1 : Math.max(0, Math.min(1, (midpoint - rect.top) / Math.max(1, rect.height)));
        row.style.setProperty('--execution-progress', String(progress));
        row.style.setProperty('--execution-marker', `${Math.min(progress, 0.92) * 100}%`);
        row.classList.toggle('is-active', progress > 0.05);
        if (preference.matches || rect.top < window.innerHeight - 80) row.classList.add('is-visible');
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    timeline.dataset.motion = 'ready';
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(timeline);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
      observer.disconnect();
      delete timeline.dataset.motion;
    };
  }, [pillars.items]);

  return (
    <section className="proposition" id="capabilities">
      <div className="container">
        <Reveal className="section-head">
          <h2>{pillars.heading}</h2>
          {pillars.lede && <p className="lede">{pillars.lede}</p>}
        </Reveal>
        <ol className="execution-timeline" ref={timelineRef}>
          {pillars.items.map((pillar, index) => (
            <li key={pillar.key} className="execution-stage">
              <div className="execution-copy">
                <span className="execution-number">#{index + 1}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
                {pillar.chips.length > 0 && (
                  <ul className="execution-steps" aria-label="Capabilities">
                    {pillar.chips.map((chip) => <li key={chip}>{chip}</li>)}
                  </ul>
                )}
              </div>
              <span className="execution-node" aria-hidden="true" />
              <div className="execution-image">
                {/* Pre-optimized static artwork; image optimization is restricted to CMS media. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMAGES[pillar.key].src} alt={IMAGES[pillar.key].alt} width={1200} height={800} loading="lazy" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
