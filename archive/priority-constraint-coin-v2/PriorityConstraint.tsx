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
  sc: number; // coin stack scale
};

const CW = 200;
const CH = 162;
// attention runs once: Legacy applications, Fragmented systems, Modernization, Cloud, Digital products, AI
const ORDER = [0, 1, 2, 5, 3, 4];
const T0 = 1.2; // first priority arrives
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
    sc: 1.15,
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
    sc: 0.82,
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

/* ---------- the one budget: a single stack of coins ---------- */

const COINS = 5;

function CoinStack() {
  const rx = 36;
  const ry = 12.5;
  const th = 8;
  return (
    <>
      <ellipse cx="0" cy={th + 2} rx={rx + 8} ry={ry + 3} fill="#071018" opacity=".08" />
      {Array.from({ length: COINS }, (_, i) => {
        const top = i === COINS - 1;
        const y = -i * (th + 5);
        return (
          <g key={i} className={top ? 'pc-topcoin' : undefined}>
            <path d={`M${-rx} ${y}v${th}a${rx} ${ry} 0 0 0 ${2 * rx} 0v${-th}Z`} fill={top ? '#0a7ba3' : '#c5d2da'} />
            <path d={`M${-rx} ${y + th * 0.5}a${rx} ${ry} 0 0 0 ${2 * rx} 0`} fill="none" stroke={top ? '#50bddf' : '#b3c2cc'} strokeWidth="1" opacity=".7" />
            <ellipse cx="0" cy={y} rx={rx} ry={ry} fill={top ? 'url(#pc-grad)' : '#e8eff3'} stroke={top ? 'none' : '#b3c2cc'} strokeWidth="1" />
            <ellipse cx="0" cy={y} rx={rx * 0.62} ry={ry * 0.62} fill="none" stroke={top ? '#fff' : '#b3c2cc'} strokeWidth="1" opacity={top ? 0.55 : 0.8} />
          </g>
        );
      })}
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

      {/* the shared budget */}
      <g transform={`translate(${cx} ${cy + 6}) scale(${l.sc})`}>
        <g className="pc-stack">
          <CoinStack />
        </g>
      </g>

      {/* priority cards: light, spacious, one symbol each */}
      {l.cards.map((c, i) => {
        const G = GLYPH[i];
        const tone = i < 3 ? SLATE : blue;
        const v = { '--a': `${T0 + ORDER.indexOf(i) * GAP}s`, '--k': i, '--dx': `${i < 3 ? -34 : 34}px` } as React.CSSProperties;
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
