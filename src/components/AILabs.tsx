'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import type { HomeData } from '@/lib/homepage';

export default function AILabs({
  aiLabs,
  onPlay,
}: {
  aiLabs: HomeData['aiLabs'];
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
    <section className="labs" id="labs">
      <div className="container">
        <Reveal className="section-head">
          <h2>{aiLabs.heading}</h2>
          {aiLabs.lede && <p className="lede">{aiLabs.lede}</p>}
        </Reveal>
        <div className="work-carousel">
          <div className="work-track labs-track" ref={trackRef} onScroll={updateEdges}>
            {aiLabs.entries.map((d) => (
              <Reveal as="article" className="lab-card" key={d.key}>
                <div className="lab-visual">
                  <Image
                    className="poc-poster"
                    src={d.poster}
                    alt={`${d.name} preview`}
                    fill
                    sizes="(max-width: 900px) 80vw, 40vw"
                  />
                  <button className="play-btn" aria-label={`Play video: ${d.name}`} onClick={() => onPlay(d.video, d.poster)}>
                    <span className="play-icon" />
                  </button>
                </div>
                <div className="lab-info">
                  <div>
                    <h3>{d.head}</h3>
                    <p>{d.copy}</p>
                    <div className="chips">
                      {d.chips.map((c) => (
                        <span className="chip" key={c}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  {d.url ? (
                    <a className="lab-link" href={d.url} target="_blank" rel="noopener">
                      Explore the experiment →
                    </a>
                  ) : (
                    <a
                      className="lab-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPlay(d.video, d.poster);
                      }}
                    >
                      Watch the demo →
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <button
            className="work-arrow work-arrow-prev"
            type="button"
            aria-label="Previous experiment"
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
            aria-label="Next experiment"
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
