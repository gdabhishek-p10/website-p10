'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Pt = [number, number];
type Layout = {
  id: 'w' | 'n';
  vb: [number, number];
  center: Pt;
  rx: number;
  ry: number;
  k: number;
  tilt: number;
  cards: Pt[];
  figs: { x: number; y: number; s: number; tone: string }[]; // pose is the index
};

const CW = 200;
const CH = 162;
// attention runs once: Legacy applications, Fragmented systems, Modernization, Cloud, Digital products, AI
const ORDER = [0, 1, 2, 5, 3, 4];
const T0 = 3.6;
const GAP = 1.5; // next card activates before the previous has settled (each holds ~2.4s)
const CONVERGE = [0, 2, 3, 4]; // several demands land together near the end

const LAYOUTS: Layout[] = [
  {
    id: 'w',
    vb: [1000, 430],
    center: [500, 252],
    rx: 178,
    ry: 62,
    k: 0.75,
    tilt: 0,
    // legacy stack (0-2), innovation stack (3-5)
    cards: [
      [130, 78],
      [186, 215],
      [130, 352],
      [870, 78],
      [814, 215],
      [870, 352],
    ],
    figs: [
      { x: 437, y: 264, s: 0.97, tone: '#3d4b57' },
      { x: 480, y: 270, s: 1.03, tone: '#465561' },
      { x: 521, y: 270, s: 1, tone: '#40505b' },
      { x: 563, y: 264, s: 0.98, tone: '#4d5c68' },
    ],
  },
  {
    id: 'n',
    vb: [540, 590],
    center: [270, 295],
    rx: 106,
    ry: 44,
    k: 0.72,
    tilt: 0,
    cards: [
      [80, 82],
      [80, 295],
      [80, 508],
      [460, 82],
      [460, 295],
      [460, 508],
    ],
    figs: [
      { x: 226, y: 300, s: 0.74, tone: '#3d4b57' },
      { x: 259, y: 305, s: 0.78, tone: '#465561' },
      { x: 291, y: 305, s: 0.76, tone: '#40505b' },
      { x: 323, y: 300, s: 0.75, tone: '#4d5c68' },
    ],
  },
];

const line = '#e3e8eb';
const blue = '#0a8fbd';

/* ---------- card glyphs: one large, simple line symbol per card (60 x 60 box, centered on 0,0) ---------- */

const SLATE = '#5b6a76';
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

/* ---------- people: understated silhouettes, each in a different deliberating pose ---------- */

// arm polylines [shoulder, elbow, hand] for left / right, per pose
const POSES: { l: Pt[]; r: Pt[] }[] = [
  // standing, considering
  { l: [[-14.5, -77], [-17, -61], [-16, -46]], r: [[14.5, -77], [17, -61], [16, -46]] },
  // hand to chin
  { l: [[-14.5, -77], [-17.5, -62], [-4, -58]], r: [[14.5, -77], [19, -63], [5, -81]] },
  // hand in pocket
  { l: [[-14.5, -77], [-17, -61], [-16, -46]], r: [[14.5, -77], [20, -62], [11, -50]] },
  // arm across the waist
  { l: [[-14.5, -77], [-18, -62], [3, -57]], r: [[14.5, -77], [17, -61], [16, -46]] },
];

const pts = (p: Pt[]) => `M${p.map((q) => q.join(' ')).join('L')}`;

function Person({ pose, tone, head }: { pose: number; tone: string; head: ReactNode }) {
  const p = POSES[pose];
  return (
    <>
      <path
        d="M-3.4 -85C-8 -84-12.5 -82.5-14.8 -77.5L-12.6 -49Q-12 -45-10.6 -43L-8.2 0H-1.3L0 -30L1.3 0H8.2L10.6 -43Q12 -45 12.6 -49L14.8 -77.5C12.5 -82.5 8 -84 3.4 -85Z"
        fill={tone}
      />
      <rect x="-2.9" y="-91" width="5.8" height="8" rx="2.4" fill={tone} />
      {[p.l, p.r].map((a, i) => (
        <path key={i} d={pts(a)} stroke={tone} strokeWidth="5.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
      {head}
    </>
  );
}

/* ---------- helpers ---------- */

const norm = (dx: number, dy: number, m: number): Pt => {
  const d = Math.hypot(dx, dy) || 1;
  return [(dx / d) * m, (dy / d) * m];
};

/* ---------- scene ---------- */

function Scene({ l }: { l: Layout }) {
  const [cx, cy] = l.center;
  return (
    <svg className={`pc-svg pc-${l.id}`} viewBox={`0 0 ${l.vb[0]} ${l.vb[1]}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      {/* the one budget: a finite boundary that emerges, then tightens when demands land together */}
      <g className="pc-ringg" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <ellipse cx={cx} cy={cy} rx={l.rx} ry={l.ry} fill="#f3f8fb" />
        <ellipse cx={cx} cy={cy} rx={l.rx} ry={l.ry} fill="none" stroke="#d5dee3" strokeWidth="2" />
        <ellipse className="pc-arc" cx={cx} cy={cy} rx={l.rx} ry={l.ry} pathLength={1} />
      </g>

      {/* competing demands */}
      {l.cards.map((c, i) => {
        const dx = c[0] - cx;
        const dy = c[1] - cy;
        const n = Math.hypot(dx / l.rx, dy / l.ry) || 1;
        const r: Pt = [cx + dx / n, cy + dy / n];
        const [mx, my] = [(c[0] + r[0]) / 2, (c[1] + r[1]) / 2];
        const [nx, ny] = norm(-(r[1] - c[1]), r[0] - c[0], 18 * (i % 2 ? 1 : -1));
        const d = `M${c[0]} ${c[1]}Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${r[0].toFixed(1)} ${r[1].toFixed(1)}`;
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        const v = { '--k': i, '--a': `${T0 + ORDER.indexOf(i) * GAP}s` } as React.CSSProperties;
        return (
          <g key={i} style={v}>
            <path className="pc-link" pathLength={1} d={d} />
            <path className={`pc-hot${cv}`} d={d} />
            <circle className="pc-node" cx={r[0]} cy={r[1]} r="3" />
          </g>
        );
      })}

      {/* stakeholders */}
      {l.figs.map((f, j) => (
        <g key={j} className="pc-fig" style={{ '--k': j } as React.CSSProperties}>
          <ellipse cx={f.x} cy={f.y + 1} rx={20 * f.s} ry={3 * f.s} fill="#071018" opacity=".1" />
          <g transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
            <Person
              pose={j}
              tone={f.tone}
              head={<circle cx="0" cy="-95" r="6.9" fill={f.tone} />}
            />
          </g>
        </g>
      ))}

      {/* priority cards: light, spacious, one symbol each */}
      {l.cards.map((c, i) => {
        const G = GLYPH[i];
        const tone = i < 3 ? SLATE : blue;
        const v = { '--a': `${T0 + ORDER.indexOf(i) * GAP}s`, '--k': i } as React.CSSProperties;
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        return (
          <g key={i} transform={`translate(${c[0]} ${c[1]}) scale(${l.k}) translate(${-CW / 2} ${-CH / 2})`}>
            <g className="pc-in" style={v}>
              <g className={`pc-att${cv}`} style={v}>
                <g filter="url(#pc-shadow)">
                  <rect width={CW} height={CH} rx="14" fill="#fff" stroke={line} />
                </g>
                <circle cx={CW / 2} cy="66" r="46" fill={i < 3 ? '#f3f6f8' : '#eaf5fa'} />
                <g transform={`translate(${CW / 2} 66) scale(1.35)`}>
                  <G c={tone} />
                </g>
                <text x={CW / 2} y="140" textAnchor="middle" className="pc-label">
                  {NAMES[i]}
                </text>
                <rect className={`pc-glow${cv}`} width={CW} height={CH} rx="14" fill="none" strokeWidth="2" style={v} />
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
      aria-label={label || 'Legacy systems, digital products, AI and cloud all competing for one limited budget'}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="pc-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#50bddf" />
            <stop offset="1" stopColor={blue} />
          </linearGradient>
          <radialGradient id="pc-glow">
            <stop offset="0" stopColor="#dff0f7" stopOpacity=".7" />
            <stop offset="1" stopColor="#dff0f7" stopOpacity="0" />
          </radialGradient>
          <filter id="pc-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#071018" floodOpacity=".08" />
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
