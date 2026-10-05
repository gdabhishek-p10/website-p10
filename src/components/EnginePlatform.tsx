'use client';

import { useId, type ReactNode } from 'react';

/*
 * The P10 delivery platform: a raised, cream-and-gold disc seen from above at an angle, cut into six
 * extruded segments around a glowing P10 cube. Drawn as layered SVG (no 3D library): each segment is a
 * top face plus an extruded wall, painted back-to-front. An active segment lifts and warms; visited ones
 * keep a soft gold tint. All motion is driven by props from the parent's clock.
 */
export const PW = 1300, PH = 660; // virtual stage
export const PCX = 650, PCY = 335;
const ORX = 396, ORY = 220, IRX = 187, IRY = 103; // outer / inner ellipse of the ring
const T = 36; // extrusion thickness
export const LIFT = 16;
const GAP = 1.6; // degrees trimmed from each side of a segment
export const SEGS = 6;

const rad = (d: number) => (d * Math.PI) / 180;
const centerDeg = (i: number) => -90 + i * 60; // Intent at the back (top), clockwise
const pt = (rx: number, ry: number, a: number, dy = 0): [number, number] => [PCX + rx * Math.cos(rad(a)), PCY + ry * Math.sin(rad(a)) + dy];
const arc = (rx: number, ry: number, a0: number, a1: number, dy = 0, n = 26) => Array.from({ length: n + 1 }, (_, k) => pt(rx, ry, a0 + ((a1 - a0) * k) / n, dy));
const poly = (pts: [number, number][]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';
const ends = (i: number): [number, number] => [centerDeg(i) - 30 + GAP, centerDeg(i) + 30 - GAP];

export const iconPos = (i: number): [number, number] => pt((ORX + IRX) / 2, (ORY + IRY) / 2, centerDeg(i));
export function calloutGeom(i: number) {
  const left = Math.cos(rad(centerDeg(i))) < -0.2;
  const [, iy] = iconPos(i);
  return { left, y: iy, edge: pt(ORX, ORY, centerDeg(i)), anchor: [left ? 206 : 1094, iy] as [number, number] };
}
// Paint order, back to front.
const ORDER = [0, 1, 5, 2, 4, 3];

type Props = {
  icons: ReactNode[]; labels: string[]; ariaLabels: string[];
  appear: number[]; act: number[]; tint: number[];
  cubeAppear: number; pulse: number;
  signal: { p: number; i: number; op: number } | null;
  leader: { i: number; op: number } | null;
  live: boolean; onOpen: (i: number) => void;
};

export default function Platform({ icons, labels, ariaLabels, appear, act, tint, cubeAppear, pulse, signal, leader, live, onOpen }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  // signal path from the cube to the active segment
  const sigPath = signal && (() => {
    const a: [number, number] = [PCX, PCY - 56], b = iconPos(signal.i);
    const c: [number, number] = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 70];
    const at = (u: number): [number, number] => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
    return { d: `M${a} Q${c} ${b}`, at };
  })();
  const lead = leader && calloutGeom(leader.i);

  // the cube
  const cx = PCX, cy = PCY + 12, w = 94, d = 47, hh = 86;
  const P = (x: number, y: number) => `${x},${y}`;
  const plate = { w: 128, d: 64, th: 22 };

  return (
    <svg className="p3" width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} aria-hidden={false}>
      <defs>
        <linearGradient id={`${uid}top`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffefb" /><stop offset="1" stopColor="#f3ebda" /></linearGradient>
        <linearGradient id={`${uid}gold`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff1c6" /><stop offset="1" stopColor="#ffdf8a" /></linearGradient>
        <linearGradient id={`${uid}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe5d0" /><stop offset="1" stopColor="#d9cbad" /></linearGradient>
        <linearGradient id={`${uid}cl`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe9a6" /><stop offset="1" stopColor="#f5c04a" /></linearGradient>
        <linearGradient id={`${uid}cr`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffeeb8" /><stop offset="1" stopColor="#f0b33a" /></linearGradient>
        <linearGradient id={`${uid}ct`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff6d6" /><stop offset="1" stopColor="#ffd96e" /></linearGradient>
        <linearGradient id={`${uid}pt`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a2c31" /><stop offset="1" stopColor="#141518" /></linearGradient>
        <radialGradient id={`${uid}glow`}><stop offset="0" stopColor="#ffd25a" stopOpacity=".55" /><stop offset="1" stopColor="#ffd25a" stopOpacity="0" /></radialGradient>
        {sigPath && (
          <mask id={`${uid}sm`} maskUnits="userSpaceOnUse" x="0" y="0" width={PW} height={PH}>
            <path d={sigPath.d} fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - signal!.p} />
          </mask>
        )}
      </defs>

      <ellipse className="p3-shadow" cx={PCX} cy={PCY + T + 20} rx={ORX + 18} ry={ORY + 8} />

      {ORDER.map((i) => {
        const [a0, a1] = ends(i);
        const front = Math.sin(rad(centerDeg(i))) > 0;
        const L = act[i] * LIFT, ap = appear[i];
        const wall = front
          ? poly([...arc(ORX, ORY, a0, a1), ...arc(ORX, ORY, a1, a0, T)])
          : poly([...arc(IRX, IRY, a0, a1), ...arc(IRX, IRY, a1, a0, T)]);
        const top = poly([...arc(ORX, ORY, a0, a1), ...arc(IRX, IRY, a1, a0)]);
        const [ix, iy] = iconPos(i);
        const glow = act[i] > 0.01 ? `drop-shadow(0 0 ${(16 * act[i]).toFixed(1)}px rgba(233,176,60,${(0.55 * act[i]).toFixed(2)}))` : undefined;
        return (
          <g key={i} className="p3-seg" role="button" aria-label={ariaLabels[i]} tabIndex={live ? 0 : -1}
            style={{ opacity: ap, transform: `translateY(${(1 - ap) * 36}px)`, pointerEvents: live ? 'auto' : 'none' }}
            onClick={(e) => { e.stopPropagation(); onOpen(i); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(i); } }}>
            <path d={top} fill="#e8dcc2" stroke="#e2d5b9" strokeWidth=".8" strokeLinejoin="round" />
            <g style={{ transform: `translateY(${-L}px)`, filter: glow }}>
              <path d={wall} fill={`url(#${uid}wall)`} stroke="#e2d5b9" strokeWidth=".8" strokeLinejoin="round" />
              <g className="p3-hv">
                <path className="p3-top" d={top} fill={`url(#${uid}top)`} stroke="#ece2cc" strokeWidth="1" strokeLinejoin="round" />
                <path d={top} fill={`url(#${uid}gold)`} opacity={Math.min(1, tint[i] * 0.22 + act[i] * 0.6)} strokeLinejoin="round" />
                <path d={top} fill="none" stroke="#e5ab3a" strokeWidth="2" opacity={act[i]} strokeLinejoin="round" />
                <svg x={ix - 29} y={iy - 47} width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={act[i] > 0.5 ? '#9a6a00' : '#111'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{icons[i]}</svg>
                <text x={ix} y={iy + 32} textAnchor="middle" className="p3-label" fill={act[i] > 0.5 ? '#7a5200' : '#1b1b1b'}>{labels[i]}</text>
              </g>
            </g>
          </g>
        );
      })}

      {lead && (
        <g opacity={leader!.op}>
          <path d={`M${lead.edge} L${lead.anchor}`} stroke="#d9a53c" strokeWidth="1.6" strokeDasharray="1 5" strokeLinecap="round" fill="none" />
          <circle cx={lead.anchor[0]} cy={lead.anchor[1]} r="4.5" fill="#d9a53c" />
          <circle cx={lead.edge[0]} cy={lead.edge[1]} r="3.5" fill="#fff" stroke="#d9a53c" strokeWidth="1.5" />
        </g>
      )}

      {/* P10 core */}
      <g style={{ opacity: cubeAppear, transform: `translateY(${(1 - cubeAppear) * 24}px)` }}>
        <ellipse className="p3-glow" cx={cx} cy={cy - 24} rx="190" ry="120" fill={`url(#${uid}glow)`} style={{ opacity: 0.55 + 0.45 * pulse }} />
        <g>
          <polygon points={[P(cx - plate.w, cy), P(cx, cy + plate.d), P(cx, cy + plate.d + plate.th), P(cx - plate.w, cy + plate.th)].join(' ')} fill="#0f1012" />
          <polygon points={[P(cx + plate.w, cy), P(cx, cy + plate.d), P(cx, cy + plate.d + plate.th), P(cx + plate.w, cy + plate.th)].join(' ')} fill="#1c1e22" />
          <polygon points={[P(cx, cy - plate.d), P(cx + plate.w, cy), P(cx, cy + plate.d), P(cx - plate.w, cy)].join(' ')} fill={`url(#${uid}pt)`} />
          <polygon points={[P(cx, cy - plate.d), P(cx + plate.w, cy), P(cx, cy + plate.d), P(cx - plate.w, cy)].join(' ')} fill="none" stroke="#f1b63e" strokeOpacity={0.35 + 0.4 * pulse} strokeWidth="1.5" />
        </g>
        <g className="p3-cube">
          <polygon points={[P(cx - w, cy - hh), P(cx, cy - hh + d), P(cx, cy + d), P(cx - w, cy)].join(' ')} fill={`url(#${uid}cl)`} stroke="#fff6dc" strokeOpacity=".8" strokeWidth="1.2" strokeLinejoin="round" />
          <polygon points={[P(cx + w, cy - hh), P(cx, cy - hh + d), P(cx, cy + d), P(cx + w, cy)].join(' ')} fill={`url(#${uid}cr)`} stroke="#fff6dc" strokeOpacity=".6" strokeWidth="1.2" strokeLinejoin="round" />
          <polygon points={[P(cx, cy - hh - d), P(cx + w, cy - hh), P(cx, cy - hh + d), P(cx - w, cy - hh)].join(' ')} fill={`url(#${uid}ct)`} stroke="#fffaf0" strokeOpacity=".9" strokeWidth="1.2" strokeLinejoin="round" />
          <g transform={`translate(${cx - w} ${cy - hh}) matrix(1 .5 0 1 0 0)`}>
            <text x={w / 2} y="46" textAnchor="middle" className="p3-p10">P10</text>
            <text x={w / 2} y="64" textAnchor="middle" className="p3-intel">INTELLIGENCE</text>
          </g>
        </g>
      </g>

      {sigPath && (
        <g opacity={signal!.op}>
          <path d={sigPath.d} fill="none" stroke="#d9a53c" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="1 7" mask={`url(#${uid}sm)`} />
          {signal!.p > 0 && signal!.p < 1 && (() => {
            const [x, y] = sigPath.at(signal!.p);
            return <g><circle cx={x} cy={y} r="11" fill="#f1b63e" opacity=".25" /><circle cx={x} cy={y} r="4.5" fill="#e5a02b" /></g>;
          })()}
        </g>
      )}
    </svg>
  );
}
