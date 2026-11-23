'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { HomeData } from '@/lib/homepage';

const THEMES = ['pink', 'green', 'blue'] as const; // no white card: the section background is white

// Pinned stack of full-height cards: each card pins while the next one slides over it,
// tilting back, shrinking and fading out as it is covered (same behaviour as gethyped.nl's expertise stack).
export default function LabStack({
  aiLabs,
  onPlay,
}: {
  aiLabs: HomeData['aiLabs'];
  onPlay: (video: string, poster: string) => void;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('.lab-stack-slide', root);
      slides.forEach((slide, index) => {
        if (index === slides.length - 1) return;
        const wrap = slide.querySelector<HTMLElement>('.lab-stack-wrap');
        const content = slide.querySelector<HTMLElement>('.lab-stack-content');
        if (!wrap || !content) return;

        gsap.to(content, {
          rotationZ: (Math.random() - 0.5) * 10,
          scale: 0.7,
          rotationX: 40,
          ease: 'power1.in',
          scrollTrigger: {
            pin: wrap,
            trigger: slide,
            start: 'top top',
            end: () => '+=' + window.innerHeight,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(content, {
          autoAlpha: 0,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: slide,
            start: () => `top+=${window.innerHeight * 0.75} top`,
            end: () => `top+=${window.innerHeight} top`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [aiLabs.entries.length]);

  // keep the looping videos paused while they are off screen
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
    });
    root.querySelectorAll('video').forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [aiLabs.entries.length]);

  return (
    <section className="lab-stack" id="labs-top" aria-label={aiLabs.heading} ref={rootRef}>
      {aiLabs.entries.map((d, i) => {
        const theme = THEMES[i % THEMES.length];
        const cta = d.url ? (
          <a className="lab-stack-btn" href={d.url} target="_blank" rel="noopener">
            <span>Get demo</span>
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </i>
          </a>
        ) : (
          <a
            className="lab-stack-btn"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPlay(d.video, d.poster);
            }}
          >
            <span>Get demo</span>
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </i>
          </a>
        );
        return (
          <div className="lab-stack-slide" key={d.key}>
            <div className="lab-stack-wrap">
              <article className={`lab-stack-content theme-${theme}`}>
                <div className="lab-stack-top">
                  <div className="lab-stack-label">AI lab</div>
                  <h2 className="lab-stack-heading">{d.name}</h2>
                  {d.chips.length > 0 && (
                    <ul className="lab-stack-chips">
                      {d.chips.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  )}
                  <div className="lab-stack-number lab-stack-heading" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <button
                  type="button"
                  className="lab-stack-img"
                  aria-label={`Play video: ${d.name}`}
                  onClick={() => onPlay(d.video, d.poster)}
                >
                  <span className="lab-stack-media">
                    <video src={d.video} poster={d.poster} muted loop playsInline autoPlay preload="metadata" />
                  </span>
                </button>
                <div className="lab-stack-bottom">
                  <h3>{d.head}</h3>
                  <p>{d.copy}</p>
                  {cta}
                </div>
              </article>
            </div>
          </div>
        );
      })}
    </section>
  );
}
