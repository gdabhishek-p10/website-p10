import type { ReactNode } from 'react';
import Reveal from './Reveal';
import type { HomeData } from '@/lib/homepage';

const ICONS: { test: RegExp; path: ReactNode }[] = [
  {
    test: /aviat|airline|flight/i,
    path: (
      <>
        <path d="M21.5 3.5 11 14" />
        <path d="M21.5 3.5 15 21l-4-8-8-4 18.5-5.5Z" />
      </>
    ),
  },
  {
    test: /engineer|manufactur|industrial/i,
    path: (
      <path d="M14.7 3.3 13 5l1.5 1.5L16 5l1.8 1.8-3.6 3.6a4 4 0 0 1-5 5l-4.5 4.5-2-2L7.2 13a4 4 0 0 1 5-5l3.6-3.6L14.7 3.3Z" />
    ),
  },
  {
    test: /health|clinic|medical|pharma/i,
    path: (
      <>
        <path d="M4 12.5h4l1.5-4 3 8 1.5-4H20" />
        <path d="M12 20c-4-2.5-8-5.4-8-9.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 3.4c0 4.2-4 7.1-8 9.6Z" />
      </>
    ),
  },
  {
    test: /bank|financ/i,
    path: (
      <>
        <path d="M3 10 12 4l9 6" />
        <path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9M3 19h18" />
      </>
    ),
  },
  {
    test: /insur/i,
    path: (
      <>
        <path d="M12 3.5 5 6v5.2c0 4.3 3 7 7 9.3 4-2.3 7-5 7-9.3V6l-7-2.5Z" />
        <path d="M9 12.2l2 2 4-4.4" />
      </>
    ),
  },
  {
    test: /retail|commerce|shop/i,
    path: (
      <>
        <path d="M5.5 8h13l-1.2 11a1.5 1.5 0 0 1-1.5 1.3H8.2a1.5 1.5 0 0 1-1.5-1.3L5.5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
  },
  {
    test: /transport|logistic|freight|supply chain/i,
    path: (
      <>
        <path d="M2.5 7h11v9h-11Z" />
        <path d="M13.5 10h4l3 3v3h-7Z" />
        <circle cx="6.5" cy="18" r="1.6" />
        <circle cx="16.5" cy="18" r="1.6" />
      </>
    ),
  },
  {
    test: /travel|tourism|hospitality/i,
    path: (
      <>
        <rect x="5" y="8" width="14" height="11" rx="1.6" />
        <path d="M9 8V6a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 6v2M5 13h14" />
      </>
    ),
  },
];

const DEFAULT_ICON = (
  <>
    <rect x="4" y="3.5" width="16" height="17" rx="1.6" />
    <path d="M8.5 8h1.5M8.5 12h1.5M8.5 16h1.5M14 8h1.5M14 12h1.5M14 16h1.5" />
  </>
);

function IndustryIcon({ name }: { name: string }) {
  const match = ICONS.find((i) => i.test.test(name));
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {match ? match.path : DEFAULT_ICON}
    </svg>
  );
}

export default function Industries({ industries }: { industries: HomeData['industries'] }) {
  return (
    <section className="industries" id="industries">
      <div className="container">
        <Reveal className="section-head">
          <h2>{industries.heading}</h2>
          {industries.lede && <p className="lede">{industries.lede}</p>}
        </Reveal>
        <Reveal className="industry-grid" stagger>
          {industries.items.map((name) => (
            <div className="industry" key={name}>
              <span className="industry-icon">
                <IndustryIcon name={name} />
              </span>
              <span className="industry-name">{name}</span>
              <svg className="industry-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
