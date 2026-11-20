'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import type { HomeData } from '@/lib/homepage';

export default function CaseStudies({
  caseStudies,
  onPlay,
}: {
  caseStudies: HomeData['caseStudies'];
  onPlay: (video: string, poster: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [shown, setShown] = useState<[number, number]>([0, 1]); // first and last story in view, for the dots

  // distance from one card to the next, and where the first card sits in the track
  function step(el: HTMLDivElement) {
    const cards = el.children as HTMLCollectionOf<HTMLElement>;
    return { first: cards[0]?.offsetLeft ?? 0, gap: cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : el.clientWidth };
  }

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    const { gap } = step(el);
    const first = Math.round(el.scrollLeft / gap);
    const inView = Math.max(1, Math.floor((el.clientWidth - parseFloat(getComputedStyle(el).paddingLeft) * 2 + 20) / gap));
    setShown([first, Math.min(caseStudies.items.length - 1, first + inView - 1)]);
  }

  // the number of stories in view depends on the screen width, so work the dots out on load and on resize too
  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  });

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.5, behavior: 'smooth' });
  }

  function scrollToCard(i: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * step(el).gap, behavior: 'smooth' });
  }

  return (
    <section className="work" id="work" aria-label={caseStudies.heading}>
      <div className="container">
        <div className="work-carousel">
          <div className="work-track" ref={trackRef} onScroll={updateEdges}>
            {caseStudies.items.map((c) => (
              <Reveal as="article" className={`case case-${c.theme}`} key={c.title}>
                <div className="case-body">
                  <span className="case-tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <a className="case-link" href={c.storyUrl} target="_blank" rel="noopener">
                    Read story →
                  </a>
                </div>
                <div className="case-media">
                  <Image
                    className="poc-poster"
                    src={c.image.url}
                    alt={c.image.alt}
                    fill
                    sizes="(max-width: 900px) 85vw, 45vw"
                  />
                  {c.video && (
                    <button
                      className="play-btn"
                      aria-label={`Play video: ${c.title}`}
                      onClick={() => onPlay(c.video!, c.image.url)}
                    >
                      <span className="play-icon" />
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="work-controls">
            <button className="work-arrow" type="button" aria-label="Previous case study" disabled={atStart} onClick={() => scrollByCard(-1)}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="work-dots">
              {caseStudies.items.map((c, i) => (
                <button
                  key={c.title}
                  type="button"
                  className={`work-dot${i >= shown[0] && i <= shown[1] ? ' is-active' : ''}`}
                  aria-label={`Show ${c.title}`}
                  aria-current={i >= shown[0] && i <= shown[1] ? 'true' : undefined}
                  onClick={() => scrollToCard(i)}
                />
              ))}
            </div>
            <button className="work-arrow" type="button" aria-label="Next case study" disabled={atEnd} onClick={() => scrollByCard(1)}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
