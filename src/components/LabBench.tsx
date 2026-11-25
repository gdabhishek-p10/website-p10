'use client';
import Reveal from './Reveal';
import { useCycle } from '@/hooks/useLabs';
import { STEPS, CLOSE, CTA } from './labApproachData';

const CYCLE_MS = 3600;

// Scale: one node at the centre, then a first ring of nodes, then a bigger second ring joined to the first.
const polar = (r: number, deg: number) => ({
  x: +(80 + r * Math.cos((deg * Math.PI) / 180)).toFixed(1),
  y: +(80 + r * Math.sin((deg * Math.PI) / 180)).toFixed(1),
});
const RING1 = Array.from({ length: 6 }, (_, i) => polar(34, -90 + i * 60));
const RING2 = Array.from({ length: 12 }, (_, i) => ({ ...polar(63, -90 + i * 30), from: RING1[Math.round(i / 2) % 6] }));

// One looping scene per step, drawn inside a round "station": a spark of an idea, a screen being built, a checklist being
// ticked, and a rollout spreading outwards. Each scene is a loop of about six seconds.
const VISUALS = [
  <div className="lb-spark" key="discover">
    <span className="lb-ripple" />
    <span className="lb-ripple lb-ripple-b" />
    <span className="lb-ripple lb-ripple-c" />
    <span className="lb-spark-icon">{STEPS[0].art}</span>
  </div>,

  // Prototype: dashed outlines of a screen fill in one block at a time while a cursor drops each block into place.
  <svg className="lb-svg" viewBox="0 0 160 160" key="prototype">
    <rect className="lb-win" x="26" y="36" width="108" height="88" rx="9" />
    <circle className="lb-wdot" cx="38" cy="46" r="2.4" />
    <circle className="lb-wdot" cx="46" cy="46" r="2.4" />
    <circle className="lb-wdot" cx="54" cy="46" r="2.4" />
    <line className="lb-wline" x1="26" y1="55" x2="134" y2="55" />
    {[
      { x: 36, y: 63, w: 88, h: 13 },
      { x: 36, y: 82, w: 38, h: 32 },
      { x: 80, y: 82, w: 44, h: 14 },
      { x: 80, y: 100, w: 44, h: 14 },
    ].map((b, i) => (
      <g key={i} className={`lb-blk lb-b${i}`}>
        <rect className="lb-ghost" x={b.x} y={b.y} width={b.w} height={b.h} rx="3" />
        <rect className="lb-solid" x={b.x} y={b.y} width={b.w} height={b.h} rx="3" />
      </g>
    ))}
    <path className="lb-cursor" d="M0 0 0 14 4 10.5 6.8 16.5 9.6 15.3 6.9 9.3 12 9.3Z" />
  </svg>,

  <div className="lb-checks" key="validate">
    {[0, 1, 2].map((r) => (
      <div className="lb-check" key={r} style={{ ['--d' as string]: `${r * 1.1}s` }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="4" className="lb-box" />
          <path d="m8 12.5 3 3 5-6" className="lb-tick" />
        </svg>
        <i />
      </div>
    ))}
  </div>,

  <svg className="lb-svg" viewBox="0 0 160 160" key="scale">
    {RING2.map((p, i) => (
      <line key={`l2-${i}`} className="lb-sl lb-sl2" x1={p.from.x} y1={p.from.y} x2={p.x} y2={p.y} style={{ ['--i' as string]: i }} />
    ))}
    {RING1.map((p, i) => (
      <line key={`l1-${i}`} className="lb-sl lb-sl1" x1="80" y1="80" x2={p.x} y2={p.y} style={{ ['--i' as string]: i }} />
    ))}
    {RING2.map((p, i) => (
      <circle key={`n2-${i}`} className="lb-sn lb-sn2" cx={p.x} cy={p.y} r="3.2" style={{ ['--i' as string]: i }} />
    ))}
    {RING1.map((p, i) => (
      <circle key={`n1-${i}`} className="lb-sn lb-sn1" cx={p.x} cy={p.y} r="5" style={{ ['--i' as string]: i }} />
    ))}
    <circle className="lb-hub-ring" cx="80" cy="80" r="11" />
    <circle className="lb-hub" cx="80" cy="80" r="10" />
  </svg>,
];

// Layout 4, "Bench": the idea travelling down a pipeline. A marker runs along a line through the four stops (it steps on
// by itself, or pick a stop), and each stop plays its own little scene above the line. No cards, no frames.
export default function LabBench({ heading, onStart }: { heading: string; onStart: () => void }) {
  const [active, setActive] = useCycle(STEPS.length, CYCLE_MS, false);
  const last = STEPS.length - 1;

  return (
    <section className="lb" id="labs">
      <div className="container">
        <Reveal className="section-head">
          <h2>{heading}</h2>
        </Reveal>

        <div
          className="lb-flow"
          style={{ ['--at' as string]: active / last }}
        >
          <div className="lb-line" aria-hidden="true">
            <span className="lb-fill" />
            <span className="lb-packet" />
          </div>
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-pressed={i === active}
              className={`lb-stage${i === active ? ' is-active' : ''}${i < active ? ' is-done' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="lb-scene" aria-hidden="true">
                {VISUALS[i]}
              </span>
              <span className="lb-dot" aria-hidden="true" />
              <span className="lb-name">{s.title}</span>
              <span className="lb-text">{s.text}</span>
            </button>
          ))}
        </div>

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
