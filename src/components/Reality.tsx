import Reveal from './Reveal';
import RealityScene from './RealityScene';
import type { HomeData } from '@/lib/homepage';

// Column copy, left to right. Each sits under its part of the illustration:
// legacy servers, the AI core, then the product windows.
const COLUMNS = [
  {
    title: 'Aging Systems Increase Costs and Slow Business Change',
    text: 'Maintaining outdated systems drains budgets and delays the changes needed to stay competitive',
  },
  {
    title: 'Your business is reacting, not predicting',
    text: 'Emerging risks and customer needs go unnoticed until costs rise and opportunities pass',
  },
  {
    title: 'Product Releases Take Too Long to Deliver Value',
    text: 'Slow delivery postpones revenue and keeps customers waiting while competitors move ahead',
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
            <div key={c.title} className="reality-col">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
