import Reveal from './Reveal';
import { slugify } from '@/lib/links';
import type { HomeData } from '@/lib/homepage';

// Illustrations come from the approved design (public/industries/*.png), matched to the industry by name.
// An industry with no match just shows its name.
const ART: { test: RegExp; src: string; w: number; h: number }[] = [
  { test: /aviat|airline|flight/i, src: '/industries/aviation.png', w: 249, h: 251 },
  { test: /engineer|manufactur|industrial/i, src: '/industries/engineering.png', w: 176, h: 251 },
  { test: /health|clinic|medical|pharma|life sci/i, src: '/industries/healthcare.png', w: 221, h: 251 },
  { test: /bank|financ|fintech|capital/i, src: '/industries/banking.png', w: 220, h: 251 },
  { test: /insur/i, src: '/industries/insurance.png', w: 235, h: 235 },
  { test: /retail|commerce|shop|consumer/i, src: '/industries/retail.png', w: 191, h: 235 },
  { test: /transport|logist|supply|freight|shipping/i, src: '/industries/transport.png', w: 221, h: 235 },
  { test: /travel|hospitality|tourism|hotel/i, src: '/industries/travel.png', w: 274, h: 235 },
];

export default function Industries({ industries }: { industries: HomeData['industries'] }) {
  return (
    <section className="industries" id="industries">
      <div className="container">
        <Reveal className="section-head">
          <h2>{industries.heading}</h2>
          {industries.lede && <p className="lede">{industries.lede}</p>}
        </Reveal>
        <Reveal className="industry-grid" stagger>
          {industries.items.map((name) => {
            const art = ART.find((a) => a.test.test(name));
            return (
              <div className="industry" key={name} id={`industry-${slugify(name)}`}>
                <span className="industry-name">
                  {name.split(' ').map((w, i) => (
                    <span key={i} style={w.includes('-') ? { whiteSpace: 'nowrap' } : undefined}>
                      {i > 0 ? (w === '&' ? ' ' : ' ') : ''}
                      {w}
                    </span>
                  ))}
                </span>
                {art && (
                  <span className="industry-art" aria-hidden="true">
                    {/* static files from /public; next/image is limited to the media paths in next.config */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={art.src} alt="" width={art.w} height={art.h} loading="lazy" />
                  </span>
                )}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
