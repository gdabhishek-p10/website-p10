'use client';
import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import { STEPS, BENEFITS, CLOSE, CTA } from './labApproachData';

// Layout 3, "Protocol": a lab protocol that runs as you scroll. The picture on the left stays put and changes with each
// step, while the steps on the right light up one at a time and the line between them fills in.
export default function LabProtocol({ heading, onStart }: { heading: string; onStart: () => void }) {
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const mid = window.innerHeight * 0.5;
      let best = 0;
      let bestDistance = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      setActive(best);
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
  }, []);

  return (
    <section className="lp" id="labs">
      <div className="container">
        <Reveal className="section-head">
          <h2>{heading}</h2>
        </Reveal>

        <div className="lp-grid">
          <div className="lp-visual" aria-hidden="true">
            <div className="lp-lens">
              <span className="lp-orbit lp-orbit-a" />
              <span className="lp-orbit lp-orbit-b" />
              {STEPS.map((s, i) => (
                <span key={s.title} className={`lp-art${i === active ? ' is-on' : ''}`}>
                  {s.art}
                </span>
              ))}
            </div>
            <div className="lp-count">
              <b>{String(active + 1).padStart(2, '0')}</b> / {String(STEPS.length).padStart(2, '0')}
            </div>
          </div>

          <ol className="lp-steps">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={`lp-step${i === active ? ' is-on' : ''}${i < active ? ' is-done' : ''}`}
              >
                <span className="lp-num">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Reveal as="ul" className="lab-benefits" stagger>
          {BENEFITS.map((b) => (
            <li key={b.title} className="lab-benefit">
              <span className="lab-benefit-icon">{b.icon}</span>
              <div>
                <b>{b.title}</b>
                <p>{b.text}</p>
              </div>
            </li>
          ))}
        </Reveal>

        <Reveal className="lab-close">
          <p>{CLOSE}</p>
          <button type="button" className="btn" onClick={onStart}>
            {CTA} <span className="arrow" aria-hidden="true">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
