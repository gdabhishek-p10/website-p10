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
  onExplore,
}: {
  aiLabs: HomeData['aiLabs'];
  onPlay: (video: string, poster: string) => void;
  onExplore: () => void;
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
        // the card sits below the slide's top padding; pin it 64px down, clear of the fixed header
        const off = () => 64 - parseFloat(getComputedStyle(slide).paddingTop);

        gsap.to(content, {
          rotationZ: (Math.random() - 0.5) * 10,
          scale: 0.7,
          rotationX: 40,
          ease: 'power1.in',
          scrollTrigger: {
            pin: wrap,
            trigger: slide,
            start: () => `top ${off()}px`,
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
            start: () => `top+=${window.innerHeight * 0.75} ${off()}px`,
            end: () => `top+=${window.innerHeight} ${off()}px`,
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
          <a className="btn lab-stack-cta" href={d.url} target="_blank" rel="noopener">
            Get demo <span className="arrow">→</span>
          </a>
        ) : (
          <a
            className="btn lab-stack-cta"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPlay(d.video, d.poster);
            }}
          >
            Get demo <span className="arrow">→</span>
          </a>
        );
        return (
          <div className="lab-stack-slide" key={d.key}>
            <div className="lab-stack-wrap">
              <article className={`lab-stack-content theme-${theme}`}>
                <div className="lab-stack-text">
                  <h2 className="lab-stack-heading">{d.name}</h2>
                  <p>{d.copy}</p>
                  {cta}
                </div>
                <button type="button" className="lab-stack-img" aria-label={`Play video: ${d.name}`} onClick={() => onPlay(d.video, d.poster)}>
                  <span className="lab-stack-media">
                    <video src={d.video} poster={d.poster} muted loop playsInline autoPlay preload="metadata" />
                  </span>
                </button>
              </article>
            </div>
          </div>
        );
      })}
      <div className="lab-stack-more">
        <button type="button" className="btn lab-stack-cta" onClick={onExplore}>
          Explore more <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
}
