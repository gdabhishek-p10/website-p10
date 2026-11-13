import Reveal from './Reveal';
import type { HomeData } from '@/lib/homepage';

type PillarKey = HomeData['pillars']['items'][number]['key'];

const VISUALS = {
  ai: { image: '/ai-execution/ai-workspace-v5.webp', alt: 'Hands working at a laptop in a bright workspace', label: 'AI in everyday work' },
  build: { image: '/ai-execution/product-workspace-v5.webp', alt: 'A mobile product prototype beside its wireframe sketches', label: 'From idea to product' },
  modernize: { image: '/ai-execution/modern-workspace-v5.webp', alt: 'A modern enterprise application in a bright office workspace', label: 'A stronger foundation' },
} as const;

function SoftwareOverlay({ kind }: { kind: PillarKey }) {
  return (
    <div className={`benefit-overlay benefit-overlay-${kind}`} aria-hidden="true">
      <div className="benefit-window-bar"><i /><i /><i /><span /></div>
      {kind === 'ai' ? (
        <div className="benefit-tasks">
          <span className="benefit-ai-mark">✦</span>
          {[0, 1, 2].map((item) => (
            <div className="benefit-task" key={item}>
              <span className="benefit-task-icon">✓</span>
              <span className="benefit-skeleton"><i /><i /></span>
              <span className="benefit-status" />
            </div>
          ))}
        </div>
      ) : kind === 'build' ? (
        <div className="benefit-prototype">
          <div className="benefit-prototype-nav"><i /><i /><i /></div>
          <div className="benefit-prototype-hero"><span /><i /></div>
          <div className="benefit-prototype-grid">{[0, 1, 2].map((item) => <div key={item}><i /><span /><span /></div>)}</div>
        </div>
      ) : (
        <div className="benefit-platform">
          <div className="benefit-platform-ring"><span>✓</span></div>
          <div className="benefit-services">{[0, 1, 2].map((item) => <span key={item}><i /><b /><em /></span>)}</div>
        </div>
      )}
    </div>
  );
}

export default function PropositionStack({ pillars }: { pillars: HomeData['pillars'] }) {
  return (
    <section className="proposition proposition-benefits" id="capabilities">
      <div className="container">
        <Reveal className="section-head benefits-heading">
          <h2>{pillars.heading}</h2>
          {pillars.lede && <p className="lede">{pillars.lede}</p>}
        </Reveal>
        <div className="benefits-list">
          {pillars.items.map((pillar, index) => (
            <Reveal key={pillar.key} className={`benefit-row benefit-row-${pillar.key}`}>
              <div className="benefit-visual">
                <div className="benefit-photo">
                  {/* Pre-optimized local photographs. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={VISUALS[pillar.key].image} alt={VISUALS[pillar.key].alt} width={1200} height={900} loading="lazy" />
                </div>
                <SoftwareOverlay kind={pillar.key} />
                <span className="benefit-float-badge" aria-hidden="true">{pillar.key === 'ai' ? '✦' : pillar.key === 'build' ? '⌘' : '✓'}</span>
              </div>
              <div className="benefit-copy">
                <span className="benefit-eyebrow">0{index + 1} / {VISUALS[pillar.key].label}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
                {pillar.chips.length > 0 && <ul className="benefit-capabilities">{pillar.chips.map((chip) => <li key={chip}>{chip}</li>)}</ul>}
                <a className="benefit-link" href={`/services#group-${pillar.key}`}>Explore services <span aria-hidden="true">↗</span></a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
