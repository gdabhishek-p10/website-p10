// The "Enterprise problems" artwork drawn as inline SVG and animated with CSS only (keyframes live in styles.css under .rs-*).
// Left to right: legacy servers and tangled cables (amber) -> floating product windows (blue) -> AI core with orbiting panels (violet),
// joined by one glowing line with a light pulse travelling along it. Drawn for a white page.

const BOXES = [
  { x: 96, y: 179, w: 92 },
  { x: 96, y: 123, w: 92 },
  { x: 96, y: 67, w: 92 },
  { x: 196, y: 179, w: 92 },
  { x: 196, y: 123, w: 92 },
  { x: 296, y: 179, w: 80 },
];
const CABLES = [
  'M110 231 C130 268 250 272 330 232',
  'M214 231 C240 264 330 268 420 222',
  'M300 231 C330 258 372 252 440 224',
  'M150 231 C170 256 212 264 256 252',
];
const WAVE = 'M330 232 C400 214 450 190 540 196 C620 202 680 246 770 238 C840 232 890 222 920 218';
const CX = 600;
const CY = 135;
const ORBIT = [0, 72, 144, 216, 288].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: CX + 96 * Math.cos(a), y: CY + 96 * Math.sin(a) };
});
const STARS: [number, number][] = [[430, 60], [520, 268], [720, 44], [830, 110], [880, 276], [1120, 66], [1140, 214], [60, 70], [380, 120]];

function Win({ x, y, w, h, cls, chart }: { x: number; y: number; w: number; h: number; cls: string; chart?: boolean }) {
  return (
    <g className={`rs-float ${cls}`}>
      <rect x={x} y={y} width={w} height={h} rx={9} fill="url(#rs-glass)" stroke="#9cc8f0" filter="url(#rs-shadow)" />
      <circle cx={x + 11} cy={y + 11} r={2.6} fill="#9cc8f0" />
      <circle cx={x + 20} cy={y + 11} r={2.6} fill="#bcd9f2" />
      <circle cx={x + 29} cy={y + 11} r={2.6} fill="#d8e8f7" />
      {chart ? (
        <polyline points={`${x + 12},${y + h - 14} ${x + w * 0.35},${y + h - 26} ${x + w * 0.55},${y + h - 20} ${x + w - 12},${y + h - 38}`} fill="none" stroke="#3b8fe0" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <rect x={x + 12} y={y + 26} width={w * 0.5} height={5} rx={2.5} fill="#bcd9f2" />
          <rect x={x + 12} y={y + 38} width={w * 0.72} height={5} rx={2.5} fill="#d6e6f6" />
          <rect x={x + 12} y={y + 50} width={w * 0.4} height={5} rx={2.5} fill="#d6e6f6" />
        </>
      )}
    </g>
  );
}

export default function RealityScene() {
  return (
    <svg className="rs" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="rs-line" gradientUnits="userSpaceOnUse" x1="330" y1="0" x2="920" y2="0">
          <stop offset="0" stopColor="#f2a14a" />
          <stop offset=".18" stopColor="#f2a14a" />
          <stop offset=".5" stopColor="#a58bff" />
          <stop offset=".88" stopColor="#5db3ff" />
        </linearGradient>
        <radialGradient id="rs-amber">
          <stop offset="0" stopColor="#f2a14a" stopOpacity=".32" />
          <stop offset="1" stopColor="#f2a14a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rs-blue">
          <stop offset="0" stopColor="#5db3ff" stopOpacity=".16" />
          <stop offset="1" stopColor="#5db3ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rs-violet">
          <stop offset="0" stopColor="#8b6cff" stopOpacity=".26" />
          <stop offset="1" stopColor="#8b6cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rs-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6f2ff" />
        </linearGradient>
        <linearGradient id="rs-cube" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f74ff" />
          <stop offset="1" stopColor="#4a2fd0" />
        </linearGradient>
        <filter id="rs-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2b6cb0" floodOpacity=".16" />
        </filter>
        <filter id="rs-glow" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ambient light for each part of the story */}
      <ellipse cx="230" cy="238" rx="190" ry="14" fill="url(#rs-amber)" />
      <ellipse cx="1000" cy="150" rx="190" ry="120" fill="url(#rs-blue)" />
      <circle className="rs-pulse" cx={CX} cy={CY} r="120" fill="url(#rs-violet)" />

      {STARS.map(([x, y], i) => (
        <circle key={i} className="rs-twinkle" style={{ animationDelay: `${-(i * 0.9).toFixed(1)}s` }} cx={x} cy={y} r={1.6} fill="#b9c4ff" />
      ))}

      {/* 01 legacy: stacked servers, blinking lights, tangled cables */}
      <g>
        {BOXES.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={52} rx={4} fill="#f4f6f8" stroke="#c9d1d8" />
            <rect x={b.x + 10} y={b.y + 14} width={b.w - 36} height={4} rx={2} fill="#dbe1e6" />
            <rect x={b.x + 10} y={b.y + 26} width={b.w - 52} height={4} rx={2} fill="#dbe1e6" />
            <circle className="rs-led" style={{ animationDelay: `${-(i * 0.7).toFixed(1)}s` }} cx={b.x + b.w - 12} cy={b.y + 12} r={3} fill="#f2a14a" />
          </g>
        ))}
        {CABLES.map((d, i) => (
          <path key={i} className="rs-cable" style={{ animationDelay: `${-(i * 0.8).toFixed(1)}s` }} d={d} fill="none" stroke="#f2a14a" strokeWidth={2} strokeLinecap="round" filter="url(#rs-glow)" />
        ))}
      </g>

      {/* the line that joins them, with a light pulse running along it */}
      <path d={WAVE} fill="none" stroke="url(#rs-line)" strokeWidth={3} strokeLinecap="round" opacity=".55" />
      <path className="rs-flow" d={WAVE} pathLength={1000} fill="none" stroke="url(#rs-line)" strokeWidth={4.5} strokeLinecap="round" strokeDasharray="60 940" filter="url(#rs-glow)" />
      <path className="rs-flow rs-flow-b" d={WAVE} pathLength={1000} fill="none" stroke="url(#rs-line)" strokeWidth={4.5} strokeLinecap="round" strokeDasharray="60 940" filter="url(#rs-glow)" />
      <circle className="rs-pulse rs-dot" cx="920" cy="218" r="5" fill="#3b8fe0" />

      {/* 02 products: floating glass windows */}
      <g transform="translate(340 0)">
        <Win x={500} y={104} w={92} h={72} cls="rs-f2" />
        <Win x={585} y={62} w={150} h={104} cls="rs-f1" />
        <Win x={724} y={84} w={96} h={64} cls="rs-f3" chart />
        <Win x={640} y={134} w={104} h={76} cls="rs-f4" />
      </g>

      {/* 03 AI: glowing core with orbiting panels */}
      <g className="rs-orbit">
        <circle cx={CX} cy={CY} r={96} fill="none" stroke="rgba(120,90,230,.4)" strokeDasharray="2 6" />
        {ORBIT.map((p, i) => (
          <g key={i} className="rs-counter">
            <rect x={p.x - 14} y={p.y - 14} width={28} height={28} rx={6} fill="#f1edff" stroke="#b9a8ff" />
            <rect x={p.x - 8} y={p.y - 4} width={16} height={3} rx={1.5} fill="#8b6cf0" />
            <rect x={p.x - 8} y={p.y + 3} width={10} height={3} rx={1.5} fill="#c6b8fa" />
          </g>
        ))}
      </g>
      <g className="rs-core">
        <rect x={CX - 40} y={CY - 40} width={80} height={80} rx={18} fill="url(#rs-cube)" stroke="#c4b6ff" strokeWidth={1.5} filter="url(#rs-glow)" />
        <path d={`M${CX} ${CY - 18} L${CX + 5} ${CY - 5} L${CX + 18} ${CY} L${CX + 5} ${CY + 5} L${CX} ${CY + 18} L${CX - 5} ${CY + 5} L${CX - 18} ${CY} L${CX - 5} ${CY - 5} Z`} fill="#fff" opacity=".95" />
      </g>
    </svg>
  );
}
