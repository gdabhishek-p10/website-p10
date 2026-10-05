'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Pt = [number, number];
type Seat = { x: number; y: number; rot: number; tone: string }; // origin = seat, +y faces the table after rotation
type Layout = {
  id: 'w' | 'n';
  vb: [number, number];
  table: { x: number; y: number; w: number; h: number };
  inset: Pt; // budget frame inset (x, y) so it clears the papers
  side: 'lr' | 'tb'; // which table edges the priorities connect to (the other two sides hold the seats)
  cards: Pt[];
  seats: Seat[];
  ps: number; // people scale
};

const CW = 118;
const CH = 104;
// priorities arrive and ask for attention once: Legacy applications, Fragmented systems, Modernization, Cloud, Digital products, AI
const ORDER = [0, 1, 2, 5, 3, 4];
const T0 = 1.2; // first priority is placed on the table
const GAP = 1.5; // next one arrives before the previous has settled (each holds ~2.2s)
const CONVERGE = [0, 2, 3, 4]; // several demands land together near the end

// formal dark suits (navy, charcoal, one grey); distinct from the black legacy cards and the ochre innovation cards
const TONES = ['#22344a', '#2b323a', '#1e2c3f', '#5d6772'];
// middle-aged to older: silver, white, salt-and-pepper, thinning, bald
type Hair = 'silver' | 'white' | 'pepper' | 'thin' | 'bald' | 'bob' | 'long';
// two of six seats (33%) are women; seen from above, hair falling over the shoulders is what reads as female
const WOMAN_TONE: Partial<Record<Hair, string>> = { long: '#6a2f45', bob: '#2f5d62' }; // burgundy and slate-teal blazers
const isWoman = (h: Hair) => h === 'long' || h === 'bob';
const HAIRS: Hair[] = ['silver', 'bald', 'bob', 'pepper', 'long', 'thin'];
const ITEMS: ('laptop' | 'notepad')[] = ['notepad', 'laptop', 'notepad', 'laptop', 'notepad', 'laptop'];

const LAYOUTS: Layout[] = [
  {
    id: 'w',
    vb: [1000, 440],
    table: { x: 300, y: 140, w: 400, h: 160 },
    inset: [16, 42],
    side: 'lr',
    ps: 1.4,
    // legacy (0-2) on the left, innovation (3-5) on the right
    cards: [
      [120, 100],
      [175, 220],
      [120, 340],
      [880, 100],
      [825, 220],
      [880, 340],
    ],
    seats: [
      { x: 380, y: 109, rot: 0, tone: TONES[0] },
      { x: 500, y: 109, rot: 0, tone: TONES[1] },
      { x: 620, y: 109, rot: 0, tone: TONES[2] },
      { x: 380, y: 331, rot: 180, tone: TONES[3] },
      { x: 500, y: 331, rot: 180, tone: TONES[0] },
      { x: 620, y: 331, rot: 180, tone: TONES[2] },
    ],
  },
  {
    id: 'n',
    vb: [440, 660],
    table: { x: 155, y: 200, w: 130, h: 240 },
    inset: [32, 16],
    side: 'tb',
    ps: 1.1,
    cards: [
      [70, 70],
      [220, 70],
      [370, 70],
      [70, 580],
      [220, 580],
      [370, 580],
    ],
    seats: [
      { x: 131, y: 250, rot: -90, tone: TONES[0] },
      { x: 131, y: 320, rot: -90, tone: TONES[1] },
      { x: 131, y: 390, rot: -90, tone: TONES[2] },
      { x: 309, y: 250, rot: 90, tone: TONES[3] },
      { x: 309, y: 320, rot: 90, tone: TONES[0] },
      { x: 309, y: 390, rot: 90, tone: TONES[2] },
    ],
  },
];

const line = '#e3e8eb';
// side colors come from CSS: legacy is near-black, innovation follows the site theme (--ochre)

/* ---------- card glyphs: one simple line symbol per card (60 x 60 box, centered on 0,0) ---------- */

const props = (c: string) => ({ fill: 'none', stroke: c, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });

function Legacy({ c }: { c: string }) {
  return (
    <g {...props(c)}>
      <rect x="-25" y="-21" width="50" height="34" rx="4" />
      <path d="M-9 22h18M0 13v9" />
      <path d="M-15 -10l8 6-8 6M-2 4h13" />
    </g>
  );
}

function Fragmented({ c }: { c: string }) {
  return (
    <g {...props(c)}>
      <circle cx="-17" cy="-13" r="8" />
      <rect x="9" y="-20" width="16" height="16" rx="3" />
      <circle cx="0" cy="16" r="8" />
      <path d="M-9 -12L6 -12M-13 -5L-6 8M15 -1L7 10" strokeDasharray="3 4" />
    </g>
  );
}

function Modern({ c }: { c: string }) {
  return (
    <g {...props(c)}>
      <rect x="-29" y="-11" width="20" height="20" strokeDasharray="3 3" />
      <path d="M-4 -1H9M4 -6l5 5-5 5" />
      <rect x="13" y="-13" width="20" height="24" rx="7" />
    </g>
  );
}

function Product({ c }: { c: string }) {
  return (
    <g {...props(c)}>
      <rect x="-25" y="-21" width="50" height="42" rx="6" />
      <path d="M-25 -10H25" />
      <rect x="-17" y="-3" width="15" height="15" rx="3" fill={c} fillOpacity=".14" />
      <path d="M6 -1h11M6 6h11M6 13h7" />
    </g>
  );
}

function AI({ c }: { c: string }) {
  return (
    <g {...props(c)}>
      <path d="M0 -24L5.5 -6.5 23 0 5.5 6.5 0 24-5.5 6.5-23 0-5.5-6.5Z" fill={c} fillOpacity=".12" />
      <path d="M19 -22v8M15 -18h8M-20 15v6M-23 18h6" />
    </g>
  );
}

function Cloud({ c }: { c: string }) {
  return (
    <g {...props(c)}>
      <path d="M-17 15H14a10 10 0 0 0 2-19.8A15 15 0 0 0-13-9 11 11 0 0 0-17 15Z" />
      <path d="M-4 3h10" opacity=".5" />
    </g>
  );
}

const NAMES = ['Legacy applications', 'Fragmented systems', 'Modernization', 'Digital products', 'AI', 'Cloud infrastructure'];
const GLYPH: ((p: { c: string }) => ReactNode)[] = [Legacy, Fragmented, Modern, Product, AI, Cloud];

/* ---------- a seated stakeholder seen from above (local: chair behind at -y, table edge at +22) ---------- */

const SKIN = '#d9b498';

function Head({ hair }: { hair: Hair }) {
  const cover: Record<string, string> = { silver: '#aeb6bd', white: '#e8ebee', pepper: '#6f777e' };
  if (hair === 'bald' || hair === 'thin') {
    return (
      <>
        <circle cx="0" cy="-8" r="9.5" fill={SKIN} />
        <path d="M-8.6 -12.4A9.5 9.5 0 0 1 8.6 -12.4" fill="none" stroke={hair === 'thin' ? '#9aa2a9' : '#b8bfc5'} strokeWidth={hair === 'thin' ? 5 : 3.2} strokeLinecap="round" />
        {hair === 'thin' && <path d="M-5 -13.5Q0 -16 5 -13.5" fill="none" stroke="#b8bfc5" strokeWidth="2.2" strokeLinecap="round" />}
      </>
    );
  }
  if (hair === 'long') {
    // shoulder-length brown hair draped over the back and shoulders
    return (
      <>
        <ellipse cx="0" cy="-17" rx="21" ry="13.5" fill="#4d3428" />
        <ellipse cx="-15" cy="-8" rx="5.6" ry="11" fill="#4d3428" transform="rotate(12 -15 -8)" />
        <ellipse cx="15" cy="-8" rx="5.6" ry="11" fill="#4d3428" transform="rotate(-12 15 -8)" />
        <circle cx="0" cy="-8" r="9.8" fill="#6a4a39" />
        <path d="M0 -17.5Q-1 -12 -0.5 -6" fill="none" stroke="#8a6650" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M-5.5 -12.5Q-1 -15 3 -13" fill="none" stroke="#8a6650" strokeWidth="1.1" strokeLinecap="round" opacity=".8" />
        <circle cx="-10.6" cy="-4.8" r="1.7" fill="#d9b25a" />
        <circle cx="10.6" cy="-4.8" r="1.7" fill="#d9b25a" />
      </>
    );
  }
  if (hair === 'bob') {
    // chin-length silver bob, wider than the head
    return (
      <>
        <ellipse cx="0" cy="-12" rx="17" ry="13.5" fill="#c5cbd0" />
        <ellipse cx="-13" cy="-7" rx="5" ry="8" fill="#c5cbd0" transform="rotate(10 -13 -7)" />
        <ellipse cx="13" cy="-7" rx="5" ry="8" fill="#c5cbd0" transform="rotate(-10 13 -7)" />
        <circle cx="0" cy="-8" r="9.8" fill="#d7dce0" />
        <path d="M0 -17.5Q-1 -12 -0.5 -6" fill="none" stroke="#aeb5bb" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="-10.6" cy="-4.8" r="1.7" fill="#d9b25a" />
        <circle cx="10.6" cy="-4.8" r="1.7" fill="#d9b25a" />
      </>
    );
  }
  return (
    <>
      <circle cx="0" cy="-8" r="9.5" fill={cover[hair]} />
      <circle cx="0" cy="-6" r="6.4" fill={hair === 'white' ? '#dfe3e6' : hair === 'pepper' ? '#5d656c' : '#9ea7ae'} />
    </>
  );
}

function Item({ kind, tilt }: { kind: 'laptop' | 'notepad'; tilt: number }) {
  if (kind === 'laptop') {
    return (
      <g transform={`rotate(${tilt} 0 36)`}>
        <rect x="-16" y="25" width="32" height="21" rx="2.4" fill="#c9d2d8" stroke="#a9b4bb" />
        <rect x="-12" y="29" width="24" height="9" rx="1.4" fill="#e3e8eb" />
        <rect x="-5" y="40" width="10" height="3.6" rx="1.2" fill="#e3e8eb" />
        <rect x="-16" y="45.5" width="32" height="3.4" rx="1.6" fill="#2c353d" />
      </g>
    );
  }
  return (
    <g transform={`rotate(${tilt} 0 40)`}>
      <rect x="-11" y="26" width="22" height="28" rx="2" fill="#fff" stroke="#cfd8dd" />
      <path d="M-6.5 33h13M-6.5 38.5h13M-6.5 44h13M-6.5 49.5h8" stroke="#d5dce1" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14.5 31l1.8 18" stroke="#1d2b3a" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function Stakeholder({ tone, hair, item, tilt, ps }: { tone: string; hair: Hair; item: 'laptop' | 'notepad'; tilt: number; ps: number }) {
  const w = isWoman(hair);
  return (
    <g transform={`scale(${ps})`}>
      <rect x="-21" y="-34" width="42" height="28" rx="10" fill="#d9dfe4" />
      <ellipse cx="0" cy="-14" rx={w ? 20.5 : 26.5} ry="13" fill={tone} />
      <path d={w ? 'M-20 -10L-14 12M20 -10L14 12' : 'M-23.5 -10L-15 12M23.5 -10L15 12'} stroke={tone} strokeWidth={w ? 6.6 : 8.6} strokeLinecap="round" />
      <ellipse cx="0" cy="-17" rx={w ? 15 : 19} ry="7" fill="#fff" opacity=".07" />
      <path d="M0 -25V-12" stroke="#000" strokeOpacity=".22" strokeWidth="1" />
      {[-1, 1].map((k) => (
        <g key={k}>
          <circle cx={k * 14.6} cy="14.2" r="4.3" fill="#f3f5f6" />
          <circle cx={k * 13.6} cy="19.6" r={w ? 2.9 : 3.5} fill={SKIN} />
        </g>
      ))}
      <Item kind={item} tilt={tilt} />
      <Head hair={hair} />
    </g>
  );
}

const rot = ([x, y]: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};

/* ---------- scene ---------- */

function Scene({ l }: { l: Layout }) {
  const t = l.table;
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const [tcx, tcy] = [t.x + t.w / 2, t.y + t.h / 2];
  // where each priority meets the table edge
  const anchor = (c: Pt): Pt =>
    l.side === 'lr'
      ? [c[0] < tcx ? t.x : t.x + t.w, clamp(c[1], t.y + 30, t.y + t.h - 30)]
      : [clamp(c[0], t.x + 26, t.x + t.w - 26), c[1] < tcy ? t.y : t.y + t.h];

  return (
    <svg className={`pc-svg pc-${l.id}`} viewBox={`0 0 ${l.vb[0]} ${l.vb[1]}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      {/* the table: one shared surface, one budget */}
      <g className="pc-table">
        <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="18" fill="url(#pc-surface)" stroke="#d3dce1" strokeWidth="1.2" filter="url(#pc-shadow)" />
      </g>
      <g className="pc-ringg" style={{ transformOrigin: `${t.x + t.w / 2}px ${t.y + t.h / 2}px` }}>
        <rect x={t.x + l.inset[0]} y={t.y + l.inset[1]} width={t.w - 2 * l.inset[0]} height={t.h - 2 * l.inset[1]} rx="12" fill="none" stroke="#d3dce1" strokeWidth="1.4" strokeDasharray="2 5" />
        <rect className="pc-frame" x={t.x + l.inset[0]} y={t.y + l.inset[1]} width={t.w - 2 * l.inset[0]} height={t.h - 2 * l.inset[1]} rx="12" pathLength={1} />
      </g>

      {/* each priority presses on the same table */}
      {l.cards.map((c, i) => {
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        const v = { '--k': i, '--a': `${T0 + ORDER.indexOf(i) * GAP}s` } as React.CSSProperties;
        const p = anchor(c);
        const d = `M${c[0]} ${c[1]}L${p[0]} ${p[1]}`;
        return (
          <g key={i} style={v} className={i < 3 ? 'pc-legacy' : 'pc-innov'}>
            <path className="pc-link" pathLength={1} d={d} />
            <path className={`pc-hot${cv}`} d={d} />
            <circle className={`pc-node${cv}`} cx={p[0]} cy={p[1]} r="3.2" />
          </g>
        );
      })}

      {/* stakeholders: seated and still */}
      {l.seats.map((s, j) => (
        <g key={j} className="pc-fig" style={{ '--k': j } as React.CSSProperties}>
          <g transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
            <Stakeholder tone={WOMAN_TONE[HAIRS[j % 6]] ?? s.tone} hair={HAIRS[j % 6]} item={ITEMS[j % 6]} tilt={[-3, 2, -2, 3][j % 4]} ps={l.ps} />
          </g>
        </g>
      ))}

      {/* priorities laid on the table */}
      {l.cards.map((c, i) => {
        const G = GLYPH[i];
        const side = i < 3 ? 0 : 1;
        const tone = 'currentColor';
        const v = { '--a': `${T0 + ORDER.indexOf(i) * GAP}s`, '--k': i } as React.CSSProperties;
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        return (
          <g key={i} className={side ? 'pc-innov' : 'pc-legacy'} transform={`translate(${c[0] - CW / 2} ${c[1] - CH / 2})`}>
            <g className="pc-in" style={v}>
              <g className={`pc-att${cv}`} style={v}>
                <g filter="url(#pc-card-shadow)">
                  <rect width={CW} height={CH} rx="11" fill="#fff" className="pc-edge" />
                </g>
                <circle cx={CW / 2} cy="42" r="29" className="pc-tint" />
                <g transform={`translate(${CW / 2} 42) scale(.88)`}>
                  <G c={tone} />
                </g>
                <text x={CW / 2} y="90" textAnchor="middle" className="pc-label">
                  {NAMES[i]}
                </text>
                <rect className={`pc-glow${cv}`} width={CW} height={CH} rx="11" fill="none" strokeWidth="2" style={v} />
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export default function PriorityConstraint({ label }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // play once when the visual scrolls into view; replay after it has fully left
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.35) el.classList.add('pc-go');
        else if (e.intersectionRatio === 0) el.classList.remove('pc-go');
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reality-photo pc-stage"
      role="img"
      aria-label={label || 'Stakeholders around one boardroom table, surrounded by competing priorities: legacy systems, digital products, AI and cloud, all drawing on a single budget'}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="pc-surface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6f8f9" />
            <stop offset="1" stopColor="#e9eef1" />
          </linearGradient>
          <filter id="pc-shadow" x="-5%" y="-10%" width="110%" height="130%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#071018" floodOpacity=".08" />
          </filter>
          <filter id="pc-card-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#071018" floodOpacity=".12" />
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#071018" floodOpacity=".06" />
          </filter>
        </defs>
      </svg>
      {LAYOUTS.map((l) => (
        <Scene key={l.id} l={l} />
      ))}
    </div>
  );
}
