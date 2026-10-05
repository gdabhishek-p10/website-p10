'use client';
import { useReveal } from '../hooks/useReveal';
import { FlowDiagram, HubDiagram, QuadDiagram } from './PropDiagrams';
import type { HomeData } from '@/lib/homepage';

type Pillar = HomeData['pillars']['items'][number];

const DIAGRAMS = {
  modernize: FlowDiagram,
  build: QuadDiagram,
  ai: HubDiagram,
} as const;

function PillarSlide({ pillar, stackClass }: { pillar: Pillar; stackClass: string }) {
  const ref = useReveal<HTMLDivElement>();
  const Diagram = DIAGRAMS[pillar.key];
  const reverse = pillar.key === 'build' ? ' prop-slide-inner-reverse' : '';

  return (
    <div ref={ref} className={`prop-slide prop-slide-${pillar.key} reveal${stackClass}`}>
      <div className={`container prop-slide-inner${reverse}`}>
        <div className="prop-slide-text">
          <h3>{pillar.title}</h3>
          <p>{pillar.body}</p>
          {pillar.chips.length > 0 && (
            <div className="chips">
              {pillar.chips.map((c) => (
                <span className="chip" key={c}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="prop-visual-wrap">
          <Diagram />
        </div>
      </div>
    </div>
  );
}

export default function PropositionStack({ pillars, animated }: { pillars: HomeData['pillars']; animated: boolean }) {
  const headRef = useReveal<HTMLDivElement>();
  const stackClass = animated ? '' : ' static-stack';

  return (
    <section className="proposition" id="capabilities">
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <h2>{pillars.heading}</h2>
          {pillars.lede && <p className="lede">{pillars.lede}</p>}
        </div>
      </div>
      {pillars.items.map((p) => (
        <PillarSlide key={p.key} pillar={p} stackClass={stackClass} />
      ))}
    </section>
  );
}
