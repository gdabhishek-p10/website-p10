import Reveal from './Reveal';
import PriorityConstraint from './PriorityConstraint';
import type { HomeData } from '@/lib/homepage';

export default function Reality({ problem }: { problem: HomeData['problem'] }) {
  return (
    <section className="reality" id="about">
      <div className="container">
        <Reveal className="reality-top">
          <h2>{problem.heading}</h2>
          {problem.lede && <p className="lede">{problem.lede}</p>}
        </Reveal>
        <Reveal className="reality-stage">
          <PriorityConstraint label={problem.image?.alt} />
        </Reveal>
      </div>
    </section>
  );
}
