'use client';
import { useRef, useState } from 'react';
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

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.5, behavior: 'smooth' });
  }

  return (
    <section className="work" id="work">
      <div className="container">
        <Reveal className="section-head">
          <h2>{caseStudies.heading}</h2>
          {caseStudies.lede && <p className="lede">{caseStudies.lede}</p>}
        </Reveal>
        <div className="work-carousel">
          <div className="work-track" ref={trackRef} onScroll={updateEdges}>
            {caseStudies.items.map((c) => (
              <Reveal as="article" className={`case case-${c.theme}`} key={c.title}>
                <div className="case-body">
                  <span className="case-tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  {c.desc && <p className="case-desc">{c.desc}</p>}
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
          <button
            className="work-arrow work-arrow-prev"
            type="button"
            aria-label="Previous case study"
            style={{ opacity: atStart ? 0 : 1, pointerEvents: atStart ? 'none' : 'auto' }}
            onClick={() => scrollByCard(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="work-arrow work-arrow-next"
            type="button"
            aria-label="Next case study"
            style={{ opacity: atEnd ? 0 : 1, pointerEvents: atEnd ? 'none' : 'auto' }}
            onClick={() => scrollByCard(1)}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
