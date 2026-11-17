import Reveal from './Reveal';
import type { HomeData } from '@/lib/homepage';

// The "AI gap" section: three problems, each with its own soft illustration drawn as inline SVG.
// Flat, outlined scenes: charcoal line work with gold fills; the motion is plain CSS (keyframes under .ag-* in styles.css).

const ART = { viewBox: '0 0 320 240', fill: 'none', 'aria-hidden': true } as const;

// Shared gradients and filters (rendered once, referenced by id).
function ArtDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="ag-blobA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fce6b0" />
          <stop offset="1" stopColor="#fff8e6" />
        </linearGradient>
        <linearGradient id="ag-blobB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe7d3" />
          <stop offset="1" stopColor="#faf7ee" />
        </linearGradient>
        <linearGradient id="ag-blobC" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fce6b0" />
          <stop offset="1" stopColor="#fff8e6" />
        </linearGradient>
        <linearGradient id="ag-bronze" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6b95f" />
          <stop offset="1" stopColor="#a8731a" />
        </linearGradient>
        <linearGradient id="ag-wave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8dc90" />
          <stop offset="1" stopColor="#d5a02a" />
        </linearGradient>
        <linearGradient id="ag-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf7ea" />
          <stop offset="1" stopColor="#cfc6ad" />
        </linearGradient>
        <linearGradient id="ag-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f3e6c3" />
        </linearGradient>
        <linearGradient id="ag-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0c968" />
          <stop offset="1" stopColor="#c2862d" />
        </linearGradient>
        <linearGradient id="ag-ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#59636f" />
          <stop offset="1" stopColor="#1a2027" />
        </linearGradient>
        <filter id="ag-blur" x="-30%" y="-200%" width="160%" height="500%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="ag-drop" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#8a6208" floodOpacity=".22" />
        </filter>
      </defs>
    </svg>
  );
}

// Two overlapping soft shapes behind each illustration.
function Blobs({ flip, tilt }: { flip?: boolean; tilt?: number }) {
  return (
    <g transform={`${flip ? 'translate(320 0) scale(-1 1) ' : ''}${tilt ? `rotate(${tilt} 160 120)` : ''}`}>
      <g className="ag-blob">
        <path d="M52 150C34 96 82 46 150 52C214 56 270 84 276 138C282 196 214 226 150 222C98 218 66 196 52 150Z" fill="url(#ag-blobA)" />
      </g>
      <g className="ag-blob ag-blob-b">
        <path d="M168 104C196 70 252 74 282 112C308 146 286 196 244 208C204 218 150 196 140 160C134 138 148 124 168 104Z" fill="url(#ag-blobB)" opacity=".85" />
      </g>
    </g>
  );
}

// Gear outline as a polygon: n teeth, outer radius r.
function gearPoints(cx: number, cy: number, r: number, n: number) {
  const step = (Math.PI * 2) / n;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = i * step;
    for (const [da, k] of [[-0.3, 0.82], [-0.17, 1], [0.17, 1], [0.3, 0.82]] as const) {
      const ang = a + da * step * 1.6;
      pts.push(`${(cx + Math.cos(ang) * r * k).toFixed(1)},${(cy + Math.sin(ang) * r * k).toFixed(1)}`);
    }
  }
  return pts.join(' ');
}

const INK = '#2a3038';
const LABEL = { fontFamily: 'inherit', fontWeight: 700, fill: INK, textAnchor: 'middle' } as const;

// Soft ground shadow and floor line shared by the three scenes.
function Ground() {
  return (
    <>
      <ellipse cx="160" cy="206" rx="128" ry="8" fill="#7a5a10" opacity=".14" filter="url(#ag-blur)" />
      <path d="M26 200H294" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </>
  );
}

// Three flat, outlined scenes (charcoal line work, gold fills). The moving parts are plain CSS (.ag-*).
const ARTWORK = {
  // aging systems: a rusty gear ("legacy") beside a safe whose money drains away
  legacy: (
    <svg {...ART}>
      <Blobs />
      <Ground />
      <g className="ag-gear">
        <polygon points={gearPoints(94, 130, 64, 10)} fill="url(#ag-bronze)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M60 100l10 8M124 96l-8 10M70 170l8-8M126 150l-10-4M92 70l1 9" stroke="#7a4a10" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="94" cy="130" r="36" fill="#fff8e6" stroke={INK} strokeWidth="4" />
      <text x="94" y="135" fontSize="14" letterSpacing=".4" {...LABEL}>LEGACY</text>
      <rect x="150" y="98" width="108" height="98" rx="10" fill="url(#ag-front)" stroke={INK} strokeWidth="4" />
      <rect x="160" y="108" width="88" height="78" rx="6" fill="#f6ecd0" stroke={INK} strokeWidth="3" />
      <circle cx="204" cy="147" r="23" fill="#fff" stroke={INK} strokeWidth="4" />
      <circle cx="204" cy="147" r="9" fill="url(#ag-gold)" stroke={INK} strokeWidth="3" />
      <path d="M204 118v6M204 170v6M175 147h6M227 147h6" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <rect x="160" y="196" width="16" height="6" rx="2" fill={INK} />
      <rect x="232" y="196" width="16" height="6" rx="2" fill={INK} />
      <g className="ag-down" strokeLinecap="round" strokeLinejoin="round">
        <path d="M138 52L176 76L190 62L236 100" stroke="#0b4a8f" strokeWidth="7" />
        <path d="M216 100H238V78" stroke="#0b4a8f" strokeWidth="7" />
      </g>
      <text className="ag-coin" x="262" y="62" fontSize="26" fontFamily="inherit" fontWeight="700" fill="#0b4a8f">$</text>
      <text className="ag-coin ag-coin-b" x="270" y="112" fontSize="22" fontFamily="inherit" fontWeight="700" fill="#0b4a8f">$</text>
    </svg>
  ),
  // reacting, not predicting: a person under an umbrella facing a wave of risk, with a forecast dashboard behind
  risks: (
    <svg {...ART}>
      <Blobs flip />
      <Ground />
      <g className="ag-wave">
        <path d="M94 200C94 170 112 140 156 128C184 121 208 134 204 154C200 146 188 145 180 152C172 160 182 176 206 180C226 184 240 192 248 200Z" fill="url(#ag-wave)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M122 168C128 154 142 146 158 144" stroke="#fff" strokeOpacity=".7" strokeWidth="3.5" strokeLinecap="round" />
        <text x="170" y="190" fontSize="14" letterSpacing=".4" {...LABEL}>RISKS</text>
      </g>
      <rect x="156" y="32" width="132" height="90" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M156 50H288" stroke={INK} strokeWidth="3" />
      <circle cx="182" cy="82" r="16" fill="#f6ecd0" stroke={INK} strokeWidth="3" />
      <path d="M182 82V66A16 16 0 0 1 196 90Z" fill="url(#ag-gold)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M182 82L196 90A16 16 0 0 1 168 90Z" fill={INK} />
      <text x="208" y="72" fontSize="10" textAnchor="start" fontFamily="inherit" fontWeight="700" fill={INK}>FORECAST</text>
      <text x="208" y="85" fontSize="10" textAnchor="start" fontFamily="inherit" fontWeight="700" fill="#a8731a">INSIGHTS</text>
      <path className="ag-chart" d="M206 112L222 102L236 107L254 94L274 98" stroke="url(#ag-gold)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path className="ag-arrow" d="M263 92H277V106" stroke="url(#ag-gold)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M88 84V122" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M44 86A44 40 0 0 1 132 86Z" fill="url(#ag-gold)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M66 86Q66 64 88 52M110 86Q110 64 88 52" stroke={INK} strokeOpacity=".35" strokeWidth="2.5" />
      <rect x="54" y="124" width="28" height="46" rx="9" fill={INK} stroke={INK} strokeWidth="3" />
      <path d="M82 134L90 122" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <circle cx="68" cy="110" r="12" fill="#f4dcb4" stroke={INK} strokeWidth="3.5" />
      <path d="M60 170V200M76 170V200" stroke={INK} strokeWidth="7" strokeLinecap="round" />
    </svg>
  ),
  // slow releases: a delayed pipeline of work reaching value late while an agile competitor races ahead
  delay: (
    <svg {...ART}>
      <Blobs tilt={-6} />
      <Ground />
      <g className="ag-fast">
        <path d="M112 52H236V42L276 62L236 82V72H112Z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <text x="168" y="66" fontSize="9.5" letterSpacing=".3" {...LABEL} fill="#fff">AGILE COMPETITOR</text>
      </g>
      <rect x="26" y="124" width="126" height="26" rx="6" fill="url(#ag-metal)" stroke={INK} strokeWidth="4" />
      <rect x="48" y="118" width="10" height="38" rx="3" fill="#e2dbc6" stroke={INK} strokeWidth="3" />
      <rect x="116" y="118" width="10" height="38" rx="3" fill="#e2dbc6" stroke={INK} strokeWidth="3" />
      <rect x="84" y="104" width="8" height="20" fill="url(#ag-metal)" stroke={INK} strokeWidth="3" />
      <circle cx="88" cy="88" r="19" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M88 71v4M71 88h4M105 88h-4" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path className="ag-needle" d="M88 88V74" stroke="#b8501d" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="88" cy="88" r="3" fill={INK} />
      <text x="88" y="176" fontSize="14" letterSpacing=".4" {...LABEL}>DELAY</text>
      <path d="M156 172H142M160 183H146" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <g className="ag-box">
        <rect x="170" y="160" width="46" height="40" rx="3" fill="#e0b25d" stroke={INK} strokeWidth="4" />
        <path d="M193 160V174" stroke={INK} strokeWidth="3" />
        <rect x="178" y="122" width="38" height="36" rx="3" fill="#ecc374" stroke={INK} strokeWidth="4" />
        <path d="M197 122V134" stroke={INK} strokeWidth="3" />
      </g>
      <path d="M222 182H240M234 174L242 182L234 190" stroke="url(#ag-gold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M248 166C248 148 296 148 296 166Z" fill="#c9961a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="248" y="166" width="48" height="34" rx="3" fill="url(#ag-gold)" stroke={INK} strokeWidth="4" />
      <rect x="266" y="162" width="12" height="38" fill={INK} opacity=".85" />
      <circle cx="272" cy="176" r="4.5" fill="#fff8e6" stroke={INK} strokeWidth="2" />
      <text x="272" y="195" fontSize="8.5" letterSpacing=".2" {...LABEL}>VALUE</text>
    </svg>
  ),
} as const;

// true: coordinated ivory, charcoal and gold editorial artwork in the cards.
// false: the drawn illustrations instead.
// Column copy, left to right (follows the approved design reference).
const COLUMNS = [
  {
    art: ARTWORK.legacy,
    tag: 'Cost',
    role: 'CFO',
    icon: 'cost',
    href: '#pillar-modernize',
    photo: { src: '/ai-gap/legacy-cutout-v7.webp', theme: 'light', alt: 'Legacy application layers with a disconnected integration, maintenance costs and a warning' },
    title: 'Aging systems increase costs and slow business change',
    text: 'Maintaining outdated systems drains budgets and delays the changes needed to stay competitive.',
  },
  {
    art: ARTWORK.risks,
    tag: 'Risk',
    role: 'CEO',
    icon: 'risk',
    href: '#pillar-ai',
    photo: { src: '/ai-gap/risk-cutout-v7.webp', theme: 'light', alt: 'A declining analytics application with late alerts obscuring the forecast' },
    title: 'Your business is reacting, not predicting',
    text: 'Emerging risks and customer needs go unnoticed until costs rise and opportunities pass.',
  },
  {
    art: ARTWORK.delay,
    tag: 'Speed',
    role: 'COO',
    icon: 'speed',
    href: '#pillar-build',
    photo: { src: '/ai-gap/delivery-cutout-v7.webp', theme: 'light', alt: 'A paused software release beside a stopwatch and waiting release schedules' },
    title: 'Product releases take too long to deliver value',
    text: 'Slow delivery postpones revenue and keeps customers waiting while competitors move ahead.',
  },
] as const;

const TAG_ICONS = {
  cost: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  risk: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Zm-3.5 9 2.5 2.5 4.5-5" />,
  speed: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
} as const;

export default function Reality({ problem }: { problem: HomeData['problem'] }) {
  const words = problem.heading.trim().split(' ');
  const last = words.pop();
  return (
    <section className="reality" id="about">
      <ArtDefs />
      <div className="container">
        <Reveal className="reality-top">
          <h2>
            {words.join(' ')} <span className="reality-accent">{last}</span>
          </h2>
          {problem.lede && <p className="lede">{problem.lede}</p>}
        </Reveal>
        <Reveal className="score-list" stagger>
          {COLUMNS.map((c) => (
            <article key={c.title} className="score-row">
              <div className="score-tag">
                <span className="reality-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {TAG_ICONS[c.icon]}
                  </svg>
                  {c.tag}
                </span>
                <span className="score-role">{c.role}</span>
              </div>
              <div className="score-copy">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <a className="link reality-help" href={c.href}>
                  How we help <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="score-art">
                {/* static files from /public; next/image is limited to the media paths in next.config */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.photo.src} alt={c.photo.alt} width={1200} height={800} loading="lazy" />
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
