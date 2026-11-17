import Reveal from './Reveal';

// Trial layout. The copy is written here for now; move it into the CMS if this layout is adopted.
const ROWS = [
  {
    n: '01',
    tag: 'Cost',
    title: 'Legacy complexity',
    text: 'Aging systems increase costs and slow business change.',
    effect: 'Higher costs.',
    icon: 'cost',
    art: '/ai-gap/legacy-cutout-v7.webp',
    alt: 'Legacy application layers with a disconnected integration, maintenance costs and a warning',
  },
  {
    n: '02',
    tag: 'Risk',
    title: 'Reactive decisions',
    text: 'Your business is reacting, not predicting.',
    effect: 'Slower decisions.',
    icon: 'risk',
    art: '/ai-gap/risk-cutout-v7.webp',
    alt: 'A declining analytics application with late alerts obscuring the forecast',
  },
  {
    n: '03',
    tag: 'Speed',
    title: 'Delayed innovation',
    text: 'Product releases take too long to deliver value.',
    effect: 'Lost opportunities.',
    icon: 'speed',
    art: '/ai-gap/delivery-cutout-v7.webp',
    alt: 'A paused software release beside a stopwatch and waiting release schedules',
  },
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
        <Reveal className="gap-grid" stagger>
          {ROWS.map((r) => (
            <article key={r.n} className="gap-card">
              <div className="gap-top">
                <span className="reality-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {ICONS[r.icon]}
                  </svg>
                  {r.tag}
                </span>
                <span className="gap-n" aria-hidden="true">{r.n}</span>
              </div>
              <div className="gap-art">
                {/* static files from /public; next/image is limited to the media paths in next.config */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.art} alt={r.alt} width={1200} height={800} loading="lazy" />
              </div>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </article>
          ))}
          <p className="gap-eyebrow">The cost of standing still</p>
          {ROWS.map((r) => (
            <p key={r.effect} className="gap-effect">
              {r.effect}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
