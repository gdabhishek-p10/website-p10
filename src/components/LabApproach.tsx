import Reveal from './Reveal';
import { STEPS, BENEFITS, CLOSE, CTA } from './labApproachData';

export default function LabApproach({ heading, onStart }: { heading: string; onStart: () => void }) {
  return (
    <section className="lab-way" id="labs">
      <div className="container">
        <Reveal className="section-head">
          <h2>{heading}</h2>
        </Reveal>

        <Reveal as="ol" className="lab-steps" stagger>
          {STEPS.map((s, i) => (
            <li key={s.title} className="lab-step">
              <span className="lab-step-art" aria-hidden="true">
                {s.art}
                <span className="lab-step-n">{i + 1}</span>
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </Reveal>

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
