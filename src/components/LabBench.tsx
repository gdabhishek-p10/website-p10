import Reveal from './Reveal';
import { STEPS, BENEFITS, CLOSE, CTA } from './labApproachData';

// A small animated picture for each step, all running in a loop: a spark, a sketch taking shape, a checklist being
// ticked, and results climbing.
const VISUALS = [
  <div className="lb-spark" key="discover">
    <span className="lb-ripple" />
    <span className="lb-ripple lb-ripple-b" />
    <span className="lb-ripple lb-ripple-c" />
    <span className="lb-spark-icon">{STEPS[0].art}</span>
  </div>,
  <div className="lb-wire" key="prototype">
    <i style={{ ['--w' as string]: '78%' }} />
    <i style={{ ['--w' as string]: '56%' }} />
    <i style={{ ['--w' as string]: '88%' }} />
    <i style={{ ['--w' as string]: '42%' }} />
    <span className="lb-caret" />
  </div>,
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
  <div className="lb-bars" key="scale">
    {[34, 52, 44, 72, 96].map((h, i) => (
      <i key={i} style={{ ['--h' as string]: `${h}%`, ['--d' as string]: `${i * 0.18}s` }} />
    ))}
    <svg className="lb-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 18 11 11l3 3 6-7M15 7h5v5" />
    </svg>
  </div>,
];

// Layout 4, "Bench": four dark lab-bench tiles, each with its own live picture, and the benefits drifting past below.
export default function LabBench({ heading, onStart }: { heading: string; onStart: () => void }) {
  return (
    <section className="lb" id="labs">
      <div className="container">
        <Reveal className="section-head">
          <h2>{heading}</h2>
        </Reveal>

        <Reveal as="ol" className="lb-tiles" stagger>
          {STEPS.map((s, i) => (
            <li key={s.title} className="lb-tile">
              <div className="lb-vis" aria-hidden="true">
                {VISUALS[i]}
              </div>
              <div className="lb-info">
                <span className="lb-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>

      <div className="lb-marquee">
        <ul className="lb-track">
          {[...BENEFITS, ...BENEFITS].map((b, i) => (
            <li key={`${b.title}-${i}`} className="lab-benefit lb-card" aria-hidden={i >= BENEFITS.length ? true : undefined}>
              <span className="lab-benefit-icon">{b.icon}</span>
              <div>
                <b>{b.title}</b>
                <p>{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="container">
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
