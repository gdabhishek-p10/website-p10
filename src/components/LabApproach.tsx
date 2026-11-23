import Reveal from './Reveal';
import type { ReactNode } from 'react';

// "P10 AI Lab": how an idea becomes a validated pilot, in plain business language.
// The demo videos live in the cards under the hero; this section explains the way of working and what customers get.
// The copy is written here for now; move it into the CMS if this layout is adopted.

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

// Each step's picture shows the idea growing: a spark, a sketch, a working screen, a launch.
const STEPS = [
  {
    title: 'Discover',
    text: 'We start with your problem and agree what success looks like',
    art: icon(<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.2 1.1 2.2h5c0-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3Z" /></>),
  },
  {
    title: 'Prototype',
    text: 'We quickly build a working version you can see and try',
    art: icon(<><rect x="3" y="4" width="18" height="14" rx="2" strokeDasharray="3 2.5" /><path d="M7 9h6M7 13h4" /><path d="m15.5 15.5 4-4 1.5 1.5-4 4H15.5Z" /></>),
  },
  {
    title: 'Validate',
    text: 'Your team tests it on real scenarios, and we measure the results together',
    art: icon(<><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8" /><path d="m8.5 11 2.5 2.5 4.5-4.5" /></>),
  },
  {
    title: 'Scale',
    text: 'If it proves its value, we take it to full rollout with confidence',
    art: icon(<><path d="M12 3c3 2 4.5 5.5 4.5 9.5L12 17l-4.5-4.5C7.5 8.5 9 5 12 3Z" /><circle cx="12" cy="9.5" r="1.6" /><path d="M7.5 12.5 5 15l2 2M16.5 12.5 19 15l-2 2M10 19l2 2 2-2" /></>),
  },
];

const BENEFITS = [
  { title: 'Proof before you invest', text: 'See the idea working before committing budget', icon: icon(<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>) },
  { title: 'A faster start', text: 'Ready-made building blocks, so you do not begin from zero', icon: icon(<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />) },
  { title: 'Built for your industry', text: 'Proven approaches from work in your sector', icon: icon(<><path d="M3 21h18M5 21V8l7-5 7 5v13" /><path d="M9 21v-6h6v6" /></>) },
  { title: 'Try it safely', text: 'A space to experiment without disrupting your business', icon: icon(<path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />) },
  { title: 'See it in action', text: 'Working demos you can show your leadership', icon: icon(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4M10 8.5l4 1.5-4 1.5Z" /></>) },
  { title: 'Expert guidance', text: 'Our specialists check that it will work at scale', icon: icon(<><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>) },
];

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
          <p>Less risk. Faster answers. Better investment decisions</p>
          <button type="button" className="btn" onClick={onStart}>
            Bring us your idea <span className="arrow" aria-hidden="true">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
