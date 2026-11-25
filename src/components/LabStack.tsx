'use client';
import { useEffect, useRef } from 'react';
import type { HomeData } from '@/lib/homepage';

const THEMES = ['pink', 'green', 'blue'] as const; // no white card: the section background is white

const easeIn = (t: number) => t * t; // gsap "power1.in"
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // gsap "power1.inOut"
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Pinned stack of full-height cards: each card pins while the next one slides over it,
// tilting back, shrinking and fading out as it is covered (same behaviour as gethyped.nl's expertise stack, and as the
// v7 branch's gsap version). Here the pin is `position: sticky` and the effect follows the scroll position directly.
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

    const slides = Array.from(root.querySelectorAll<HTMLElement>('.lab-stack-slide'));
    const contents = slides.map((s) => s.querySelector<HTMLElement>('.lab-stack-content'));
    const tilt = slides.map(() => (Math.random() - 0.5) * 10); // each card leans a different way, up to 5 degrees
    root.classList.add('is-pinned');
    let frame = 0;

    function update() {
      frame = 0;
      if (!root) return;
      const vh = window.innerHeight;
      const slideH = slides[0].offsetHeight;
      const pad = parseFloat(getComputedStyle(slides[0]).paddingTop);
      const off = 64 - pad; // the card pins 64px down, clear of the fixed header
      const rootTop = root.getBoundingClientRect().top + window.scrollY;

      slides.forEach((slide, i) => {
        const content = contents[i];
        if (!content || i === slides.length - 1) return; // the last card just stays
        // progress through the covered phase: 0 when the card pins, 1 one screen of scrolling later
        const p = clamp01((window.scrollY - (rootTop + i * slideH - off)) / vh);
        const e = easeIn(p);
        const fade = easeInOut(clamp01((p - 0.75) / 0.25)); // it only fades over the last quarter
        // once the next card has fully covered this one there is nothing left to show, so it stays out of the way of
        // whatever follows (the last card and the button after it)
        const covered = window.scrollY >= rootTop + (i + 1) * slideH - off;
        content.style.transform = p > 0 ? `rotateZ(${tilt[i] * e}deg) rotateX(${40 * e}deg) scale(${1 - 0.3 * e})` : '';
        content.style.opacity = String(covered ? 0 : 1 - fade);
        content.style.visibility = covered || fade >= 1 ? 'hidden' : 'visible';
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
      root.classList.remove('is-pinned');
    };
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
          <div className={`lab-stack-slide${i === aiLabs.entries.length - 1 ? ' is-last' : ''}`} key={d.key}>
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
