'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import type { HomeData } from '@/lib/homepage';

// `bare` renders just the cards, with no heading, for the carousel straight under the hero title
export default function AILabs({
  aiLabs,
  onPlay,
  bare = false,
}: {
  aiLabs: HomeData['aiLabs'];
  onPlay: (video: string, poster: string) => void;
  bare?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const [shown, setShown] = useState<[number, number]>([0, 1]); // first and last experiment in view, for the dots

  // distance from one card to the next
  function gap(el: HTMLDivElement) {
    const cards = el.children as HTMLCollectionOf<HTMLElement>;
    return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : el.clientWidth;
  }

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setAtEnd(end);
    const g = gap(el);
    const inView = Math.max(1, Math.floor((el.clientWidth + 20) / g));
    const first = end ? Math.max(0, aiLabs.entries.length - inView) : Math.round(el.scrollLeft / g);
    const last = Math.min(aiLabs.entries.length - 1, first + inView - 1);
    // keep the same array when nothing changed, otherwise the effect below re-renders forever
    setShown((prev) => (prev[0] === first && prev[1] === last ? prev : [first, last]));
  }

  // the number of experiments in view depends on the screen width, so work the dots out on load and on resize too
  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  });

  function scrollToCard(i: number) {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * gap(el), behavior: 'smooth' });
  }

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.5, behavior: 'smooth' });
  }

  return (
    <section className={bare ? 'work' : 'labs'} id={bare ? 'labs-top' : 'labs'} aria-label={bare ? aiLabs.heading : undefined}>
      <div className="container">
        {!bare && (
          <Reveal className="section-head">
            <h2>{aiLabs.heading}</h2>
          </Reveal>
        )}
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
                    {!bare && <p>{d.copy}</p>}
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
                      Get demo →
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
                      Get demo →
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="work-controls">
            <button className="work-arrow" type="button" aria-label="Previous experiment" disabled={atStart} onClick={() => scrollByCard(-1)}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="work-dots">
              {aiLabs.entries.map((d, i) => (
                <button
                  key={d.key}
                  type="button"
                  className={`work-dot${i >= shown[0] && i <= shown[1] ? ' is-active' : ''}`}
                  aria-label={`Show ${d.name}`}
                  aria-current={i >= shown[0] && i <= shown[1] ? 'true' : undefined}
                  onClick={() => scrollToCard(i)}
                />
              ))}
            </div>
            <button className="work-arrow" type="button" aria-label="Next experiment" disabled={atEnd} onClick={() => scrollByCard(1)}>
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
