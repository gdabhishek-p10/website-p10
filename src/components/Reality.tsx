import Reveal from './Reveal';
import RealityScene from './RealityScene';
import type { HomeData } from '@/lib/homepage';

const ICON = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

const ICONS = {
  costs: (
    <svg {...ICON}>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v5.5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6" />
      <path d="M5 11.5V17c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5.5" />
    </svg>
  ),
  change: (
    <svg {...ICON}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  ),
  experience: (
    <svg {...ICON}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18c1.2-2.3 3.1-3.3 5.5-3.3s4.3 1 5.5 3.3" />
    </svg>
  ),
  growth: (
    <svg {...ICON}>
      <path d="M5 20v-6M11 20V9M17 20v-9" />
      <path d="M4 20h16" />
      <path d="M15 5h4v4" />
      <path d="M19 5l-5 5" />
    </svg>
  ),
  knowledge: (
    <svg {...ICON}>
      <ellipse cx="12" cy="5.5" rx="6.5" ry="2.5" />
      <path d="M5.5 5.5v13c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-13" />
      <path d="M5.5 12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
    </svg>
  ),
  opportunity: (
    <svg {...ICON}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  ),
} as const;

// The three problems the section frames; each tone matches the colour of its part of the artwork.
const COLUMNS = [
  {
    tone: 'amber',
    title: 'Legacy',
    effects: [
      { icon: ICONS.costs, label: 'Higher costs' },
      { icon: ICONS.change, label: 'Slower change' },
    ],
  },
  {
    tone: 'blue',
    title: 'Products',
    effects: [
      { icon: ICONS.experience, label: 'Poorer experiences' },
      { icon: ICONS.growth, label: 'Limited growth' },
    ],
  },
  {
    tone: 'violet',
    title: 'AI',
    effects: [
      { icon: ICONS.knowledge, label: 'Siloed knowledge' },
      { icon: ICONS.opportunity, label: 'Missed opportunities' },
    ],
  },
] as const;

export default function Reality({ problem }: { problem: HomeData['problem'] }) {
  const words = problem.heading.trim().split(' ');
  const last = words.pop();
  return (
    <section className="reality" id="about">
      <div className="container">
        <Reveal className="reality-top">
          <h2>
            {words.join(' ')} <span className="reality-accent">{last}</span>
          </h2>
          {problem.lede && <p className="lede">{problem.lede}</p>}
        </Reveal>
      </div>
      <Reveal className="reality-art">
        <RealityScene />
      </Reveal>
      <div className="container">
        <Reveal className="reality-cols" stagger>
          {COLUMNS.map((c) => (
            <div key={c.title} className={`reality-col reality-${c.tone}`}>
              <h3>{c.title}</h3>
              <ul className="reality-effects">
                {c.effects.map((e) => (
                  <li key={e.label}>
                    {e.icon}
                    <span>{e.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
