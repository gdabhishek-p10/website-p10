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
  k: number; // card scale
  map: number[]; // which seat's notepad / laptop each card connects to (six people, six ideas)
};

const CW = 170;
const CH = 138;
const HDR = 21; // label strip along the top; the artwork fills the rest
// priorities arrive and ask for attention once: Legacy applications, Fragmented systems, Modernization, Cloud, Digital products, AI
const ORDER = [0, 1, 2, 5, 3, 4];
const T0 = 1.8; // when the first card lands; its idea (the line) starts about a second earlier
const GAP = 1.5; // next one arrives before the previous has settled (each holds ~2.2s)
const CONVERGE = [0, 2, 3, 4]; // several demands land together near the end

// Six stakeholders, each different: age (middle-aged to older), hair colour and style, skin tone, suit, posture.
// Two of six are women (a third). Seat 4 is the speaker; most others look at her, two look down at their work.
type HairStyle = 'short' | 'bald' | 'bob' | 'long';
type Person = {
  tone: string; // suit
  skin: string;
  hair: { style: HairStyle; color: string };
  glasses?: boolean;
  woman?: boolean;
  posture: number; // index into POSTURES
  item: 'notepad' | 'laptop';
  looks: 'speaker' | 'down' | 'forward';
};
const SPEAKER = 4;
const PEOPLE: Person[] = [
  { tone: '#22344a', skin: '#dcb79c', hair: { style: 'short', color: '#a4acb3' }, glasses: true, posture: 0, item: 'notepad', looks: 'speaker' }, // grey, arms on the table
  { tone: '#2b323a', skin: '#d3ac90', hair: { style: 'bald', color: '#e4e8eb' }, posture: 1, item: 'notepad', looks: 'speaker' }, // bald, hands folded
  { tone: '#2f5d62', skin: '#e6c3a8', hair: { style: 'bob', color: '#d9b868' }, woman: true, posture: 2, item: 'notepad', looks: 'speaker' }, // blond bob, leaning in
  { tone: '#5d6772', skin: '#b7855f', hair: { style: 'short', color: '#1c1f24' }, posture: 3, item: 'laptop', looks: 'down' }, // black hair, typing
  { tone: '#6a2f45', skin: '#cfa382', hair: { style: 'long', color: '#5a3d2e' }, woman: true, posture: 5, item: 'notepad', looks: 'forward' }, // brown long hair, the speaker
  { tone: '#1e2c3f', skin: '#e1bea3', hair: { style: 'short', color: '#e9ecef' }, glasses: true, posture: 4, item: 'notepad', looks: 'down' }, // white hair, writing notes
];

const LAYOUTS: Layout[] = [
  {
    id: 'w',
    vb: [1000, 470],
    table: { x: 300, y: 155, w: 400, h: 160 },
    inset: [16, 42],
    side: 'lr',
    ps: 1.4,
    k: 1,
    map: [0, 1, 3, 2, 4, 5],
    // legacy (0-2) on the left, innovation (3-5) on the right
    cards: [
      [125, 87],
      [165, 235],
      [125, 383],
      [875, 87],
      [835, 235],
      [875, 383],
    ],
    seats: [
      { x: 380, y: 124, rot: 0, tone: '#000' },
      { x: 500, y: 124, rot: 0, tone: '#000' },
      { x: 620, y: 124, rot: 0, tone: '#000' },
      { x: 380, y: 346, rot: 180, tone: '#000' },
      { x: 500, y: 346, rot: 180, tone: '#000' },
      { x: 620, y: 346, rot: 180, tone: '#000' },
    ],
  },
  {
    id: 'n',
    vb: [440, 660],
    table: { x: 155, y: 200, w: 130, h: 240 },
    inset: [32, 16],
    side: 'tb',
    ps: 1.1,
    k: 0.66,
    map: [0, 4, 3, 2, 1, 5],
    cards: [
      [70, 70],
      [220, 70],
      [370, 70],
      [70, 580],
      [220, 580],
      [370, 580],
    ],
    seats: [
      { x: 131, y: 250, rot: -90, tone: '#000' },
      { x: 131, y: 320, rot: -90, tone: '#000' },
      { x: 131, y: 390, rot: -90, tone: '#000' },
      { x: 309, y: 250, rot: 90, tone: '#000' },
      { x: 309, y: 320, rot: 90, tone: '#000' },
      { x: 309, y: 390, rot: 90, tone: '#000' },
    ],
  },
];

const line = '#e3e8eb';
// side colors come from CSS: legacy is near-black, innovation follows the site theme (--ochre)

/* ---------- card artwork: small product-style illustrations (156 x 108 space, scaled into each card) ---------- */

const D = { panel: '#33424f', edge: '#4a5b69', dim: '#7f93a3', ok: '#8fb9a2', deep: '#10171d', amber: '#d8b15a' };
const OC = '#b8860b'; // the site's ochre
const OCL = '#e0b653';
const OCT = '#faf1d9';

function Legacy() {
  return (
    <>
      {/* rack of units */}
      <rect x="12" y="12" width="42" height="84" rx="5" fill={D.panel} stroke={D.edge} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="17" y={18 + i * 26} width="32" height="21" rx="3" fill="#27333d" stroke={D.edge} />
          <circle cx="24" cy={28.5 + i * 26} r="2.3" fill={i === 1 ? D.amber : D.ok} />
          <path d={`M31 ${24 + i * 26}h13M31 ${28.5 + i * 26}h13M31 ${33 + i * 26}h8`} stroke={D.dim} strokeWidth="1.5" strokeLinecap="round" opacity=".7" />
        </g>
      ))}
      {/* terminal */}
      <rect x="64" y="12" width="82" height="60" rx="6" fill={D.deep} stroke={D.edge} />
      <rect x="64" y="12" width="82" height="11" rx="6" fill="#1a232b" />
      <rect x="64" y="17" width="82" height="6" fill="#1a232b" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={71 + i * 6} cy="17.5" r="1.8" fill={D.edge} />
      ))}
      <path d="M72 33h36M72 41h50M72 49h28M72 57h42" stroke={D.ok} strokeWidth="2.6" strokeLinecap="round" opacity=".85" />
      <rect x="104" y="54" width="7" height="6.5" fill="#b9d6c4" />
      {/* keyboard */}
      <rect x="64" y="80" width="82" height="16" rx="5" fill={D.panel} stroke={D.edge} />
      <path d="M71 88h68" stroke={D.dim} strokeWidth="3" strokeDasharray="5 3" opacity=".55" />
    </>
  );
}

function Cyl({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 16} ${y - 8}v22c0 5 7 8 16 8s16-3 16-8v-22`} fill="url(#pc-dcyl)" stroke={D.dim} strokeWidth="1.3" />
      <ellipse cx={x} cy={y - 8} rx="16" ry="6.5" fill="#43535f" stroke={D.dim} strokeWidth="1.3" />
      <path d={`M${x - 16} ${y + 3}c0 5 7 8 16 8s16-3 16-8`} fill="none" stroke={D.edge} strokeWidth="1.3" />
    </g>
  );
}

function Systems() {
  const n: Pt[] = [
    [34, 34],
    [122, 30],
    [78, 78],
    [20, 84],
    [136, 82],
  ];
  const edges: [number, number, boolean][] = [
    [0, 1, false],
    [0, 2, true],
    [1, 2, false],
    [0, 3, false],
    [1, 4, true],
    [2, 4, false],
    [3, 2, true],
    [0, 4, true],
  ];
  return (
    <>
      {edges.map(([a, b, dash], i) => (
        <path key={i} d={`M${n[a][0]} ${n[a][1]}L${n[b][0]} ${n[b][1]}`} stroke={D.dim} strokeWidth="1.3" strokeDasharray={dash ? '3 3' : undefined} opacity=".85" />
      ))}
      <Cyl x={34} y={36} />
      <Cyl x={122} y={32} />
      <Cyl x={78} y={82} />
      {[[20, 84], [136, 82]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 8} y={y - 8} width="16" height="16" rx="3.5" fill={D.panel} stroke={D.dim} strokeWidth="1.3" />
          <circle cx={x} cy={y} r="2.4" fill="#a9bac6" />
        </g>
      ))}
    </>
  );
}

function Modern() {
  const old: Pt[] = [
    [20, 20],
    [42, 20],
    [20, 42],
    [42, 42],
  ];
  const fresh: Pt[] = [
    [98, 20],
    [120, 20],
    [98, 42],
    [120, 42],
  ];
  return (
    <>
      {old.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="18" height="18" rx="2" fill={i === 3 ? 'none' : '#3d4d5a'} stroke={D.dim} strokeDasharray={i === 3 ? '2 2' : undefined} />
      ))}
      {fresh.map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="18"
          height="18"
          rx="6"
          fill={i === 0 ? 'url(#pc-oc)' : i === 1 ? OCL : 'none'}
          fillOpacity={i === 1 ? 0.7 : 1}
          stroke={i > 1 ? OCL : 'none'}
          strokeDasharray={i > 1 ? '2 2' : undefined}
        />
      ))}
      <g fill="none" stroke="#a9bac6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M66 33a13 13 0 0 1 22-5M89 24l-1 6-6-1" />
        <path d="M90 41a13 13 0 0 1-22 5M67 50l1-6 6 1" />
      </g>
      <rect x="20" y="72" width="116" height="12" rx="6" fill={D.edge} />
      <rect x="20" y="72" width="66" height="12" rx="6" fill="url(#pc-oc)" />
      <rect x="20" y="90" width="52" height="4" rx="2" fill={D.edge} opacity=".8" />
    </>
  );
}

function Product() {
  return (
    <>
      <rect x="0" y="0" width="156" height="22" fill="#f4f6f7" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={13 + i * 10} cy="11" r="3" fill={i === 0 ? OCL : '#dce2e5'} />
      ))}
      <path d="M0 22H156" stroke={line} />
      <path d="M36 22V108" stroke={line} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="11" y={32 + i * 17} width="14" height="10" rx="3" fill={i === 0 ? OC : '#e3e8eb'} opacity={i === 0 ? 0.9 : 1} />
      ))}
      <rect x="46" y="30" width="52" height="6" rx="3" fill="#d4dbe0" />
      <rect x="46" y="41" width="98" height="32" rx="8" fill="url(#pc-oc)" />
      <path d="M52 64c10-13 18 4 30-8s20 6 30-4 14-2 26-10" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".85" />
      <circle cx="132" cy="50" r="3" fill="#fff" opacity=".9" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={46 + i * 34} y="81" width="30" height="16" rx="5" fill="#f0f2f4" stroke={line} />
      ))}
      <rect x="114" y="84" width="28" height="10" rx="5" fill={OC} />
    </>
  );
}

function AI() {
  const nodes = Array.from({ length: 7 }, (_, i): Pt => {
    const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
    return [78 + Math.cos(a) * 42, 54 + Math.sin(a) * 34];
  });
  return (
    <>
      <ellipse cx="78" cy="54" rx="52" ry="42" fill="none" stroke="#e6dcc0" strokeDasharray="2 4" />
      {nodes.map((p, i) => (
        <g key={i}>
          <path d={`M78 54L${p[0]} ${p[1]}`} stroke="#dcc98f" strokeWidth="1.3" />
          {i > 0 && <path d={`M${nodes[i - 1][0]} ${nodes[i - 1][1]}L${p[0]} ${p[1]}`} stroke="#ece6d4" strokeWidth="1" />}
        </g>
      ))}
      {nodes.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i % 3 === 0 ? 5 : 3.6} fill="#fff" stroke={i % 3 === 0 ? OC : '#b4b9bd'} strokeWidth="1.6" />
      ))}
      <circle cx="78" cy="54" r="19" fill={OCT} stroke={OC} strokeWidth="1.5" />
      <path d="M78 41l3.2 9 9 3.2-9 3.2L78 65.4l-3.2-9-9-3.2 9-3.2L78 41Z" fill="url(#pc-oc)" />
      <path d="M99 29l1.3 3.2 3.2 1.3-3.2 1.3L99 38l-1.3-3.2-3.2-1.3 3.2-1.3L99 29Z" fill={OC} opacity=".7" />
    </>
  );
}

function Cloud() {
  return (
    <>
      <path
        d="M52 50a13 13 0 0 1 2-25.8A19 19 0 0 1 90 21a15.5 15.5 0 0 1 14 29Z"
        transform="translate(6 -2) scale(1.06)"
        fill={OCT}
        stroke={OC}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M62 34h6M76 34h14" stroke={OCL} strokeWidth="2" strokeLinecap="round" />
      <path d="M50 58v10M78 58v10M106 58v10" stroke="#cfc6ad" strokeWidth="1.3" strokeDasharray="2 3" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 34 - 6} y="70" width="30" height="24" rx="4.5" fill="#fff" stroke="#c9ced2" strokeWidth="1.4" />
          <path d={`M${30 + i * 34 - 1} 77.5h20M${30 + i * 34 - 1} 85h20`} stroke="#e3e7ea" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx={30 + i * 34 + 19} cy="77.5" r="1.9" fill={OC} />
        </g>
      ))}
    </>
  );
}

const NAMES = ['Legacy applications', 'Fragmented systems', 'Modernization', 'Digital products', 'AI', 'Cloud infrastructure'];
const ART: ReactNode[] = [<Legacy key="a" />, <Systems key="b" />, <Modern key="c" />, <Product key="d" />, <AI key="e" />, <Cloud key="f" />];

/* ---------- a seated stakeholder seen from above (local: chair behind at -y, table edge at +22) ---------- */

type P2 = [number, number];
type Posture = { lean: number; l: P2[]; r: P2[]; hands: P2[]; clasp?: boolean; open?: boolean; pen?: boolean };

// arms are [shoulder, elbow, hand] in local coordinates (facing +y towards the table edge at y=22)
const POSTURES: Posture[] = [
  // 0: forearms resting on the table
  { lean: 0, l: [[-23, -10], [-25, 9], [-14, 28]], r: [[23, -10], [25, 9], [14, 28]], hands: [[-13.5, 29.5], [13.5, 29.5]] },
  // 1: hands folded
  { lean: 1, l: [[-23, -10], [-21, 10], [-5, 28]], r: [[23, -10], [21, 10], [5, 28]], hands: [[-4, 29.5], [4, 29.5]], clasp: true },
  // 2: leaning in, both forearms forward
  { lean: 8, l: [[-22, -10], [-24, 12], [-12, 33]], r: [[22, -10], [24, 12], [12, 33]], hands: [[-11.5, 34.5], [11.5, 34.5]] },
  // 3: typing on a laptop
  { lean: 3, l: [[-22, -10], [-22, 11], [-8, 33]], r: [[22, -10], [22, 11], [8, 33]], hands: [[-7.5, 34], [7.5, 34]] },
  // 4: writing notes, pen in the right hand
  { lean: 3, l: [[-23, -10], [-22, 10], [-14, 31]], r: [[23, -10], [22, 12], [8, 37]], hands: [[-13.5, 32.5], [7.5, 38]], pen: true },
  // 5: the speaker, one hand open in explanation, the other on the table
  { lean: 3, l: [[-23, -10], [-24, 9], [-13, 28]], r: [[23, -10], [35, 5], [31, 26]], hands: [[-12.5, 29.5], [30.5, 28]], open: true },
];

function Head({ p, turn, lean }: { p: Person; turn: number; lean: number }) {
  const { style, color } = p.hair;
  const cy = -8 + lean * 0.9;
  const bald = style === 'bald';
  const woman = !!p.woman;
  return (
    <>
      {/* hair falling behind the head and over the shoulders (does not turn with the head) */}
      {style === 'long' && (
        <>
          <ellipse cx="0" cy={cy - 9} rx="21" ry="13.5" fill={color} />
          <ellipse cx="-15" cy={cy} rx="5.6" ry="11" fill={color} transform={`rotate(12 -15 ${cy})`} />
          <ellipse cx="15" cy={cy} rx="5.6" ry="11" fill={color} transform={`rotate(-12 15 ${cy})`} />
        </>
      )}
      {style === 'bob' && (
        <>
          <ellipse cx="0" cy={cy - 4} rx="16.5" ry="13" fill={color} />
          <ellipse cx="-12.5" cy={cy + 1} rx="5" ry="8" fill={color} transform={`rotate(10 -12.5 ${cy + 1})`} />
          <ellipse cx="12.5" cy={cy + 1} rx="5" ry="8" fill={color} transform={`rotate(-10 12.5 ${cy + 1})`} />
        </>
      )}
      <g transform={`translate(0 ${cy}) rotate(${turn})`}>
        <ellipse cx="-9.4" cy="0" rx="1.9" ry="2.6" fill={p.skin} />
        <ellipse cx="9.4" cy="0" rx="1.9" ry="2.6" fill={p.skin} />
        {bald ? (
          <>
            <circle cx="0" cy="0" r="9.6" fill={p.skin} />
            <path d="M-8.4 -4.6A9.6 9.6 0 0 1 8.4 -4.6" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="0" cy="0" r="9.8" fill={color} />
            <circle cx="0" cy="-1.5" r="6.6" fill="#fff" opacity=".14" />
            <ellipse cx="0" cy="5.2" rx="6.7" ry="4.6" fill={p.skin} />
            <path d="M-6.8 3.4Q0 -1.2 6.8 3.4" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
          </>
        )}
        {p.glasses && (
          <>
            <path d="M-6.6 6.2Q0 8.6 6.6 6.2" fill="none" stroke="#252b31" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M-7.6 5.6L-9.4 1.4M7.6 5.6L9.4 1.4" stroke="#252b31" strokeWidth="1.1" strokeLinecap="round" />
          </>
        )}
        {woman && (
          <>
            <circle cx="-10.6" cy="1" r="1.5" fill="#d9b25a" />
            <circle cx="10.6" cy="1" r="1.5" fill="#d9b25a" />
          </>
        )}
      </g>
    </>
  );
}

function Item({ kind, tilt, hidePen }: { kind: 'laptop' | 'notepad'; tilt: number; hidePen?: boolean }) {
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
      {!hidePen && <path d="M14.5 31l1.8 18" stroke="#1d2b3a" strokeWidth="1.8" strokeLinecap="round" />}
    </g>
  );
}

function Stakeholder({ p, tilt, ps, turn }: { p: Person; tilt: number; ps: number; turn: number }) {
  const po = POSTURES[p.posture];
  const w = !!p.woman;
  const sx = w ? 0.86 : 1;
  const lean = po.lean;
  // shoulders move with the lean, hands stay on the table
  const arm = (a: P2[]): string => `M${a[0][0] * sx} ${a[0][1] + lean}L${a[1][0] * sx} ${a[1][1] + lean * 0.5}L${a[2][0]} ${a[2][1]}`;
  const cuff = (a: P2[]): P2 => [a[1][0] * sx + (a[2][0] - a[1][0] * sx) * 0.8, a[1][1] + (a[2][1] - a[1][1]) * 0.8];
  return (
    <g transform={`scale(${ps})`}>
      <rect x="-21" y="-34" width="42" height="28" rx="10" fill="#d9dfe4" />
      <ellipse cx="0" cy={-14 + lean} rx={26.5 * sx} ry="13" fill={p.tone} />
      <ellipse cx="0" cy={-17 + lean} rx={19 * sx} ry="7" fill="#fff" opacity=".07" />
      <path d="M0 -26V-12" transform={`translate(0 ${lean})`} stroke="#000" strokeOpacity=".2" strokeWidth="1" />
      <Item kind={p.item} tilt={tilt} hidePen={po.pen} />
      {[po.l, po.r].map((a, i) => (
        <path key={i} d={arm(a)} stroke={p.tone} strokeWidth={w ? 6.8 : 8.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
      {[po.l, po.r].map((a, i) => (
        <circle key={i} cx={cuff(a)[0]} cy={cuff(a)[1]} r="4.1" fill="#f3f5f6" />
      ))}
      {po.hands.map((h, i) => (
        <circle key={i} cx={h[0]} cy={h[1]} r={w ? 3 : 3.6} fill={p.skin} />
      ))}
      {po.clasp && <ellipse cx="0" cy="30" rx="5.2" ry="3.4" fill={p.skin} />}
      {po.pen && <path d="M7.5 38L12.5 29.5" stroke="#1d2b3a" strokeWidth="1.7" strokeLinecap="round" />}
      {po.open && (
        <>
          <ellipse cx="30.5" cy="28.5" rx="4.8" ry="4.2" fill={p.skin} />
          <path d="M27.2 31.5l-1.4 4M29.4 32.4l-.2 4.6M31.8 32.2l.9 4.4M33.9 30.6l1.9 3.4" stroke={p.skin} strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}
      <Head p={p} turn={turn} lean={lean} />
    </g>
  );
}

const norm = (dx: number, dy: number, m: number): Pt => {
  const d = Math.hypot(dx, dy) || 1;
  return [(dx / d) * m, (dy / d) * m];
};

const rot = ([x, y]: Pt, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};

/* ---------- table decor, centred on (0,0), laid out along the table's length ---------- */

function Pen({ x, y, r, c }: { x: number; y: number; r: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d="M-15 0H12" stroke={c} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M12 0l4.6 0" stroke="#c9d2d8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-15 0H-9" stroke="#fff" strokeOpacity=".35" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

function Coffee({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="1" cy="2.5" rx="12.5" ry="12" fill="#071018" opacity=".07" />
      <circle r="11.5" fill="#fff" stroke="#dfe4e7" />
      <circle r="7.6" fill="#fff" stroke="#cfd6da" />
      <circle r="5.9" fill="#5a3a28" />
      <path d="M-3.4 -2.2A4.2 4.2 0 0 1 1 -4.2" fill="none" stroke="#8a6248" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.4 -2.4Q13 -1.8 12.2 2.6Q11.4 5 7.6 4.4" fill="none" stroke="#cfd6da" strokeWidth="2" strokeLinecap="round" />
      <path d="M-2 11.4L4.6 8.4" stroke="#c9d2d8" strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );
}

function Plant() {
  return (
    <g>
      <ellipse cx="1.5" cy="3.5" rx="19.5" ry="19" fill="#071018" opacity=".09" />
      <circle r="18" fill="#f3efe6" stroke="#d9d3c4" strokeWidth="1.2" />
      <circle r="14.4" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.2" />
      <circle r="12.6" fill="#6b5644" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-7.4"
          rx="3.5"
          ry="8.2"
          fill={i % 2 ? '#6da179' : '#4f8060'}
          transform={`rotate(${i * 45 + (i % 2) * 8})`}
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx="0" cy="-4.2" rx="2.4" ry="5.2" fill={i % 2 ? '#8dbf98' : '#7fb08a'} transform={`rotate(${i * 72 + 20})`} />
      ))}
      <circle r="2.1" fill="#a9d1b1" />
    </g>
  );
}

function Water({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="1" cy="2.5" rx="9" ry="9" fill="#071018" opacity=".07" />
      <circle r="7.6" fill="#dcebf2" stroke="#b7d0dd" strokeWidth="1.2" />
      <circle r="3.6" fill="#f3f9fc" stroke="#b7d0dd" />
      {[[-15, 9], [14, -10]].map(([gx, gy], i) => (
        <g key={i} transform={`translate(${gx} ${gy})`}>
          <circle r="5.4" fill="#eaf4f9" stroke="#b7d0dd" strokeWidth="1.1" />
          <circle r="3.4" fill="#f8fcfe" />
        </g>
      ))}
    </g>
  );
}

function TableDecor() {
  return (
    <>
      <Water x={-118} y={-8} />
      <Coffee x={-64} y={-14} />
      <Pen x={-34} y={18} r={-12} c="#1d2b3a" />
      <Pen x={-30} y={26} r={-2} c="#7b8a96" />
      <Plant />
      <Coffee x={62} y={16} />
      <Pen x={37} y={-16} r={168} c="#1d2b3a" />
      <Pen x={104} y={-6} r={14} c="#b8860b" />
      <Water x={126} y={12} />
    </>
  );
}

/* ---------- scene ---------- */

function Scene({ l }: { l: Layout }) {
  const t = l.table;
  // head turn for each seat: towards the speaker, or straight ahead when looking down at their work
  const headAt = (sIdx: number): Pt => {
    const st = l.seats[sIdx];
    const [dx, dy] = rot([0, -8 * l.ps], st.rot);
    return [st.x + dx, st.y + dy];
  };
  const sp = headAt(SPEAKER);
  const turns = l.seats.map((st, j) => {
    if (PEOPLE[j % 6].looks !== 'speaker') return 0;
    const h = headAt(j);
    const [lx, ly] = rot([sp[0] - h[0], sp[1] - h[1]], -st.rot);
    const deg = (Math.atan2(-lx, ly) * 180) / Math.PI;
    return Math.max(-62, Math.min(62, deg));
  });
  // centre of a person's notepad or laptop on the table
  const itemAt = (sIdx: number): Pt => {
    const st = l.seats[sIdx];
    const [dx, dy] = rot([0, 40 * l.ps], st.rot);
    return [st.x + dx, st.y + dy];
  };

  return (
    <svg className={`pc-svg pc-${l.id}`} viewBox={`0 0 ${l.vb[0]} ${l.vb[1]}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      {/* the table: one shared surface, one budget */}
      <g className="pc-table">
        <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="18" fill="url(#pc-surface)" stroke="#d3dce1" strokeWidth="1.2" filter="url(#pc-shadow)" />
      </g>
      {/* things on the table: potted plant, coffee, pens, water */}
      <g
        className="pc-table"
        transform={`translate(${t.x + t.w / 2} ${t.y + t.h / 2}) rotate(${l.side === 'tb' ? 90 : 0}) scale(${l.side === 'tb' ? 0.82 : 1})`}
      >
        <TableDecor />
      </g>

      {/* each priority is one person's idea: it connects to their notepad or laptop */}
      {l.cards.map((c, i) => {
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        const v = { '--k': i, '--a': `${T0 + ORDER.indexOf(i) * GAP}s` } as React.CSSProperties;
        const p = itemAt(l.map[i]);
        // drawn from the notepad out to the card: the idea flows from the person to the priority
        const d = `M${p[0].toFixed(1)} ${p[1].toFixed(1)}L${c[0]} ${c[1]}`;
        return (
          <g key={i} style={v} className={i < 3 ? 'pc-legacy' : 'pc-innov'}>
            <path className="pc-link" pathLength={1} d={d} />
            <path className={`pc-hot${cv}`} pathLength={1} d={d} />
          </g>
        );
      })}

      {/* stakeholders: seated and still, each with their own posture and line of sight */}
      {l.seats.map((s, j) => {
        const person = PEOPLE[j % 6];
        return (
          <g key={j} className="pc-fig" style={{ '--k': j } as React.CSSProperties}>
            <g transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
              <Stakeholder p={person} tilt={[-3, 2, -2, 3][j % 4]} ps={l.ps} turn={turns[j]} />
            </g>
          </g>
        );
      })}

      {/* a node where each line meets its notepad */}
      {l.cards.map((c, i) => {
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        const v = { '--k': i, '--a': `${T0 + ORDER.indexOf(i) * GAP}s` } as React.CSSProperties;
        const p = itemAt(l.map[i]);
        const [ux, uy] = norm(c[0] - p[0], c[1] - p[1], 15 * l.ps);
        return (
          <g key={i} style={v} className={i < 3 ? 'pc-legacy' : 'pc-innov'}>
            <circle className="pc-ping" cx={p[0] + ux} cy={p[1] + uy} r="3.4" />
            <circle className={`pc-node${cv}`} cx={p[0] + ux} cy={p[1] + uy} r="3.4" />
          </g>
        );
      })}

      {/* the competing priorities: dark, dense legacy stack on the left; light, open innovation stack on the right */}
      {l.cards.map((c, i) => {
        const dark = i < 3;
        const v = { '--a': `${T0 + ORDER.indexOf(i) * GAP}s`, '--k': i } as React.CSSProperties;
        const cv = CONVERGE.includes(i) ? ' pc-cv' : '';
        return (
          <g key={i} className={dark ? 'pc-legacy' : 'pc-innov'} transform={`translate(${c[0]} ${c[1]}) scale(${l.k}) translate(${-CW / 2} ${-CH / 2})`}>
            <g className="pc-in" style={v}>
              <g className={`pc-att${cv}`} style={v}>
                <g filter="url(#pc-card-shadow)">
                  <rect width={CW} height={CH} rx="14" fill={dark ? 'url(#pc-dark)' : 'url(#pc-light)'} stroke={dark ? '#3b4a57' : '#e9dfc4'} />
                </g>
                <g clipPath="url(#pc-clip)">
                  <g transform={`translate(0 ${HDR}) scale(${CW / 156})`}>{ART[i]}</g>
                  <rect width={CW} height={HDR} fill={dark ? '#1b242c' : '#fff'} opacity={dark ? 0.7 : 0.95} />
                </g>
                <path d={`M0 ${HDR}H${CW}`} stroke={dark ? '#3b4a57' : '#ece4cd'} />
                <path d="M14 1.2H156" stroke="#fff" strokeOpacity={dark ? 0.1 : 0.9} strokeWidth="1.2" strokeLinecap="round" />
                <text x={CW / 2} y={HDR / 2 + 4} textAnchor="middle" className={`pc-label${dark ? ' pc-label-d' : ''}`}>
                  {NAMES[i]}
                </text>
                <rect className={`pc-glow${cv}`} width={CW} height={CH} rx="14" fill="none" strokeWidth="2.2" style={v} />
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
          <linearGradient id="pc-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c3945" />
            <stop offset="1" stopColor="#1a232b" />
          </linearGradient>
          <linearGradient id="pc-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#fcf8ee" />
          </linearGradient>
          <linearGradient id="pc-oc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e2b955" />
            <stop offset="1" stopColor="#b8860b" />
          </linearGradient>
          <linearGradient id="pc-dcyl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a4955" />
            <stop offset="0.5" stopColor="#3f4f5c" />
            <stop offset="1" stopColor="#2c3843" />
          </linearGradient>
          <clipPath id="pc-clip">
            <rect width={CW} height={CH} rx="14" />
          </clipPath>
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
