'use client';
import { useState } from 'react';
import { useCycle } from '@/hooks/useLabs';
import { STEPS, BENEFITS, CLOSE, CTA } from './labApproachData';

const CYCLE_MS = 4800;

// Layout 2, "Pipeline": the idea travelling through the lab. A data packet runs along a circuit and lights each stage in
// turn (it steps on by itself until the mouse is over it, or pick a stage); the stage's detail reads out below.
export default function LabFlow({ heading, onStart }: { heading: string; onStart: () => void }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useCycle(STEPS.length, CYCLE_MS, hover);
  const last = STEPS.length - 1;
  const step = STEPS[active];

  return (
    <section className="lw" id="labs">
      <div className="lw-panel" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <h2 className="lw-title">{heading}</h2>

        <div className="lw-track" role="tablist" aria-label="From idea to pilot" style={{ ['--at' as string]: active / last }}>
          <div className="lw-line" aria-hidden="true">
            <span className="lw-fill" />
            <span className="lw-packet" />
          </div>
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`lw-node${i === active ? ' is-active' : ''}${i < active ? ' is-done' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="lw-orb" aria-hidden="true">
                {s.art}
                <span className="lw-n">{i + 1}</span>
              </span>
              <span className="lw-name">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="lw-detail" role="tabpanel" key={active}>
          <span className="lw-stage" aria-hidden="true">
            Stage {String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </span>
          <p>{step.text}</p>
          <span className="lw-gauge" aria-hidden="true">
            {STEPS.map((s, i) => (
              <i key={s.title} className={i <= active ? 'is-on' : ''} />
            ))}
          </span>
        </div>

        <ul className="lw-outs">
          {BENEFITS.map((b, i) => (
            <li key={b.title} className="lw-out" style={{ animationDelay: `${i * 0.9}s` }}>
              <span className="lw-out-icon">{b.icon}</span>
              <div>
                <b>{b.title}</b>
                <p>{b.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="lw-close">
          <p>{CLOSE}</p>
          <button type="button" className="lw-btn" onClick={onStart}>
            {CTA} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
