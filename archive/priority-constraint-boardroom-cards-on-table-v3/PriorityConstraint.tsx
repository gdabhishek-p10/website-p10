'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Pt = [number, number];
type Seat = { x: number; y: number; rot: number; tone: string }; // origin = seat, +y faces the table after rotation
type Layout = {
  id: 'w' | 'n';
  vb: [number, number];
  table: { x: number; y: number; w: number; h: number };
  inset: Pt; // budget frame inset (x, y) so it clears the papers
  cards: Pt[];
  seats: Seat[];
};

const CW = 118;
const CH = 104;
// priorities arrive and ask for attention once: Legacy applications, Fragmented systems, Modernization, Cloud, Digital products, AI
const ORDER = [0, 1, 2, 5, 3, 4];
const T0 = 1.2; // first priority is placed on the table
const GAP = 1.5; // next one arrives before the previous has settled (each holds ~2.2s)
const CONVERGE = [0, 2, 3, 4]; // several demands land together near the end

const TONES = ['#3d4b57', '#465561', '#40505b', '#4d5c68'];

const LAYOUTS: Layout[] = [
  {
    id: 'w',
    vb: [1000, 440],
    table: { x: 30, y: 92, w: 940, h: 236 },
    inset: [16, 32],
    // legacy (0-2) on the left, innovation (3-5) on the right
    cards: [
      [130, 210],
      [270, 210],
      [410, 210],
      [590, 210],
      [730, 210],
      [870, 210],
    ],
    seats: [
      { x: 175, y: 64, rot: 0, tone: TONES[0] },
      { x: 365, y: 64, rot: 0, tone: TONES[1] },
      { x: 620, y: 64, rot: 0, tone: TONES[2] },
      { x: 815, y: 64, rot: 0, tone: TONES[3] },
      { x: 270, y: 356, rot: 180, tone: TONES[2] },
      { x: 500, y: 356, rot: 180, tone: TONES[0] },
      { x: 730, y: 356, rot: 180, tone: TONES[3] },
    ],
  },
  {
    id: 'n',
    vb: [440, 660],
    table: { x: 90, y: 20, w: 260, h: 620 },
    inset: [32, 16],
    cards: [
      [155, 130],
      [155, 330],
      [155, 530],
      [285, 130],
      [285, 330],
      [285, 530],
    ],
    seats: [
      { x: 62, y: 130, rot: -90, tone: TONES[0] },
      { x: 62, y: 330, rot: -90, tone: TONES[1] },
      { x: 62, y: 530, rot: -90, tone: TONES[2] },
      { x: 378, y: 130, rot: 90, tone: TONES[3] },
      { x: 378, y: 330, rot: 90, tone: TONES[2] },
      { x: 378, y: 530, rot: 90, tone: TONES[0] },
    ],
  },
];

const line = '#e3e8eb';
const blue = '#0a8fbd';
const SLATE = '#5b6a76';

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
      <rect x="13" y="-13" width="20" height="24" rx="7" stroke={blue} />
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

function Stakeholder({ tone, tilt }: { tone: string; tilt: number }) {
  return (
    <g transform="scale(1.25)">
      <rect x="-21" y="-34" width="42" height="28" rx="10" fill="#d9e1e6" />
      <ellipse cx="0" cy="-14" rx="26" ry="13" fill={tone} />
      <path d="M-23 -10L-15 15M23 -10L15 15" stroke={tone} strokeWidth="8" strokeLinecap="round" />
      <circle cx="0" cy="-8" r="9.5" fill="#2b3640" />
      <rect x="-11" y="25" width="22" height="15" rx="2.5" fill="#fff" stroke="#cfd8dd" transform={`rotate(${tilt} 0 32)`} />
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
  const heads: Pt[] = l.seats.map((s) => {
    const [dx, dy] = rot([0, -10], s.rot);
    return [s.x + dx, s.y + dy];
  });
  const pathTo = (c: Pt, h: Pt) => `M${c[0]} ${c[1]}L${h[0].toFixed(1)} ${h[1].toFixed(1)}`;

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

      {/* attention lines from each priority to the people nearest it */}
      {l.cards.map((c, i) => {
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        const v = { '--k': i, '--a': `${T0 + ORDER.indexOf(i) * GAP}s` } as React.CSSProperties;
        const near = [0, 1].map((side) => {
          const idx = l.seats.map((_, j) => j).filter((j) => (l.id === 'w' ? (l.seats[j].rot === 0) === (side === 0) : (l.seats[j].rot < 0) === (side === 0)));
          return idx.reduce((b, j) => {
            const dj = l.id === 'w' ? Math.abs(heads[j][0] - c[0]) : Math.abs(heads[j][1] - c[1]);
            const db = l.id === 'w' ? Math.abs(heads[b][0] - c[0]) : Math.abs(heads[b][1] - c[1]);
            return dj < db ? j : b;
          }, idx[0]);
        });
        return (
          <g key={i} style={v}>
            {near.map((j) => (
              <g key={j}>
                <path className={`pc-hot${cv}`} d={pathTo(c, heads[j])} />
              </g>
            ))}
          </g>
        );
      })}

      {/* stakeholders: seated and still */}
      {l.seats.map((s, j) => (
        <g key={j} className="pc-fig" style={{ '--k': j } as React.CSSProperties}>
          <g transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
            <Stakeholder tone={s.tone} tilt={[-4, 3, -2, 4][j % 4]} />
          </g>
        </g>
      ))}

      {/* priorities laid on the table */}
      {l.cards.map((c, i) => {
        const G = GLYPH[i];
        const tone = i < 3 ? SLATE : blue;
        const v = { '--a': `${T0 + ORDER.indexOf(i) * GAP}s`, '--k': i } as React.CSSProperties;
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        return (
          <g key={i} transform={`translate(${c[0] - CW / 2} ${c[1] - CH / 2})`}>
            <g className="pc-in" style={v}>
              <g className={`pc-att${cv}`} style={v}>
                <g filter="url(#pc-card-shadow)">
                  <rect width={CW} height={CH} rx="11" fill="#fff" stroke={line} />
                </g>
                <circle cx={CW / 2} cy="42" r="29" fill={i < 3 ? '#f1f4f6' : '#eaf5fa'} />
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
      aria-label={label || 'Stakeholders around one table weighing legacy systems, digital products, AI and cloud against a single budget'}
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
