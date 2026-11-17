import Reveal from './Reveal';

// Trial layout from the design reference. The copy is written here for now; move it into the CMS if this layout is adopted.
const ROWS = [
  { n: '01', tag: 'Cost', title: 'Legacy complexity', text: 'Aging systems increase costs and slow business change.', icon: 'cost' },
  { n: '02', tag: 'Risk', title: 'Reactive decisions', text: 'Your business is reacting, not predicting.', icon: 'risk' },
  { n: '03', tag: 'Speed', title: 'Delayed innovation', text: 'Product releases take too long to deliver value.', icon: 'speed' },
] as const;

const ICONS = {
  cost: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </>
  ),
  risk: <path d="M3 21V10M8 21v-7M13 21v-9M18 21V8M3 8l6-4 4 3 7-5" />,
  speed: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2M9 2h6M12 2v3" />
    </>
  ),
} as const;

export default function GapScorecard() {
  return (
    <section className="gap" id="about">
      <div className="container">
        <Reveal className="section-head">
          <h2>The AI gap is widening.</h2>
          <p className="lede">
            Waiting on AI means carrying higher operating costs while revenue drifts to businesses that serve customers faster.
          </p>
        </Reveal>
        <Reveal className="gap-wrap" stagger>
          <ol className="gap-list">
            {ROWS.map((r) => (
              <li key={r.n} className="gap-row">
                <span className="gap-n" aria-hidden="true">{r.n}</span>
                <div className="gap-copy">
                  <h3>
                    {r.tag.toUpperCase()} — {r.title}
                  </h3>
                  <p>{r.text}</p>
                </div>
                <svg className="gap-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {ICONS[r.icon]}
                </svg>
              </li>
            ))}
          </ol>
          <div className="gap-banner">
            <span>The cost of standing still</span>
            <p>Higher costs. Slower decisions. Lost opportunities.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
