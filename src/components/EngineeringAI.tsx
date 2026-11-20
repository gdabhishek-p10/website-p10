import Reveal from './Reveal';
import EngineeringRing from './EngineeringRing';
import type { HomeData } from '@/lib/homepage';

export default function EngineeringAI({ engineering }: { engineering: HomeData['engineering'] }) {
  return (
    <section className="engineering" id="engineering-ai">
      <div className="container">
        <Reveal className="section-head">
          <h2>{engineering.heading}</h2>
        </Reveal>
        <Reveal className="system-visual">
          <EngineeringRing />
        </Reveal>
      </div>
    </section>
  );
}
