'use client'

import { useEffect, useRef, useState } from 'react'

/* An abstract AI pipeline: data sources -> agents -> outcomes. Comet pulses travel along
   the curves (SMIL animateMotion) and each node glows as a pulse lands. One 7.2s loop. */

const T = 7.2
const SX = 52
const AX = 280
const OX = 504
const SRC = [128, 212, 296, 380]
const SRC_ICON = ['doc', 'db', 'img', 'chat'] as const
const AGT = [
  { y: 150, w: 92, label: 'RAG', hub: false },
  { y: 260, w: 132, label: 'Agentic AI', hub: true },
  { y: 370, w: 92, label: 'Vision', hub: false },
]
const OUT = [150, 260, 370]
const OUT_ICON = ['trend', 'check', 'spark'] as const

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const mx = x1 + (x2 - x1) * 0.52
  return `M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`
}
const srcEdge = (s: number, a: number) => curve(SX + 15, SRC[s], AX - AGT[a].w / 2, AGT[a].y)
const outEdge = (a: number, o: number) => curve(AX + AGT[a].w / 2, AGT[a].y, OX - 25, OUT[o])

// [source, agent, start]; travel 1.6s
const IN = [
  [0, 0, 0.0], [1, 1, 0.4], [3, 2, 0.9], [2, 1, 2.7], [0, 1, 3.4], [1, 0, 4.2], [3, 1, 4.9], [2, 2, 5.3],
] as const
// [agent, outcome, start, travel]
const OUTP = [
  [0, 0, 1.75, 1.5], [1, 1, 2.15, 1.5], [2, 2, 2.65, 1.5], [1, 0, 4.45, 1.5], [1, 2, 5.15, 1.5], [0, 1, 5.95, 1.2],
] as const

const IN_D = 1.6
const agentHits: number[][] = [[], [], []]
IN.forEach(([, a, s]) => agentHits[a].push(+(s + IN_D).toFixed(2)))
const outHits: number[][] = [[], [], []]
OUTP.forEach(([, o, s, d]) => outHits[o].push(+(s + d).toFixed(2)))

type Pulse = { d: string; start: number; dur: number }
const PULSES: Pulse[] = [
  ...IN.map(([s, a, st]) => ({ d: srcEdge(s, a), start: st, dur: IN_D })),
  ...OUTP.map(([a, o, st, du]) => ({ d: outEdge(a, o), start: st, dur: du })),
]

function Icon({ k }: { k: string }) {
  switch (k) {
    case 'doc': return <path d="M-4.5 -6.5h6l3.5 3.5v9.5h-9.5zM1.5 -6.5v3.5h3.5M-2 1h5M-2 3.6h5" />
    case 'db': return <><ellipse cx="0" cy="-4.5" rx="5.5" ry="2.2" /><path d="M-5.5 -4.5v9c0 1.2 2.5 2.2 5.5 2.2s5.5-1 5.5-2.2v-9M-5.5 0c0 1.2 2.5 2.2 5.5 2.2s5.5-1 5.5-2.2" /></>
    case 'img': return <><rect x="-6.5" y="-5.5" width="13" height="11" rx="2" /><circle cx="-2.6" cy="-1.6" r="1.3" /><path d="M-6.5 4l4-4 3 3 2.4-2.4 4.1 4" /></>
    case 'chat': return <path d="M-6.5 -5.5h13v8.5h-6.5l-3.5 3v-3h-3z" />
    case 'trend': return <path d="M-7 5l5-6 3 3 6-8M2 -5h5.5v5.5" />
    case 'check': return <path d="M-6 0.5l4.5 4.5 8-9.5" />
    default: return <path className="ha-flow-fill" d="M0 -8.5C1 -3.5 3.5 -1 8.5 0C3.5 1 1 3.5 0 8.5C-1 3.5 -3.5 1 -8.5 0C-3.5 -1 -1 -3.5 0 -8.5z" />
  }
}

export default function HeroArtFlow() {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [reduced, setReduced] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let visible = true
    const apply = () => setPaused(!visible || document.hidden)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; apply() }, { threshold: 0.05 })
    io.observe(root)
    document.addEventListener('visibilitychange', apply)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', apply) }
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || reduced) return
    if (paused) svg.pauseAnimations()
    else svg.unpauseAnimations()
  }, [paused, reduced])

  const f = (n: number) => n.toFixed(4)

  return (
    <div ref={rootRef} className={`ha-flow${paused ? ' is-paused' : ''}${reduced ? ' is-static' : ''}`}>
      <svg ref={svgRef} className="ha-flow-svg" viewBox="0 0 560 500" preserveAspectRatio="xMidYMid meet" role="presentation">
        <defs>
          <radialGradient id="haf-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#faf1d9" stopOpacity="1" />
            <stop offset="0.6" stopColor="#faf1d9" stopOpacity="0.45" />
            <stop offset="1" stopColor="#faf1d9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haf-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#dcae3a" stopOpacity="0.55" />
            <stop offset="1" stopColor="#dcae3a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="haf-tail" gradientUnits="userSpaceOnUse" x1="-30" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#dcae3a" stopOpacity="0" />
            <stop offset="1" stopColor="#b8860b" stopOpacity="0.85" />
          </linearGradient>
          <filter id="haf-shadow" x="-30%" y="-40%" width="160%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#071018" floodOpacity="0.1" />
          </filter>
        </defs>

        <ellipse cx="280" cy="262" rx="250" ry="215" fill="url(#haf-bg)" />

        {/* base connections */}
        <g className="ha-flow-edges" fill="none" strokeLinecap="round">
          {IN.map(([s, a], i) => <path key={`i${i}`} d={srcEdge(s, a)} />)}
          {[[0, 0], [1, 1], [2, 2], [1, 0], [1, 2], [0, 1]].map(([a, o], i) => <path key={`o${i}`} d={outEdge(a, o)} />)}
          {[[0, 1], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2], [3, 2], [0, 0]].filter(([s, a]) => !IN.some(([ss, aa]) => ss === s && aa === a)).map(([s, a], i) => <path key={`x${i}`} d={srcEdge(s, a)} />)}
        </g>

        {/* sources */}
        {SRC.map((y, i) => (
          <g key={`s${i}`} transform={`translate(${SX} ${y})`}>
            <circle r="15" className="ha-flow-src" filter="url(#haf-shadow)" />
            <g className="ha-flow-ico"><Icon k={SRC_ICON[i]} /></g>
          </g>
        ))}

        {/* agents */}
        {AGT.map((a, i) => {
          const h = a.hub ? 54 : 40
          return (
            <g key={`a${i}`} transform={`translate(${AX} ${a.y})`}>
              {a.hub && <rect className="ha-flow-breathe" x={-a.w / 2 - 6} y={-h / 2 - 6} width={a.w + 12} height={h + 12} rx={(h + 12) / 2} />}
              {!reduced && agentHits[i].map((t, k) => (
                <rect key={k} className="ha-flow-halo" style={{ animationDelay: `${t}s` }} x={-a.w / 2} y={-h / 2} width={a.w} height={h} rx={h / 2} />
              ))}
              <rect className={a.hub ? 'ha-flow-pill is-hub' : 'ha-flow-pill'} x={-a.w / 2} y={-h / 2} width={a.w} height={h} rx={h / 2} filter="url(#haf-shadow)" />
              <text className={a.hub ? 'ha-flow-t is-hub' : 'ha-flow-t'} y={a.hub ? 5.5 : 5} textAnchor="middle">{a.label}</text>
            </g>
          )
        })}

        {/* outcomes */}
        {OUT.map((y, i) => (
          <g key={`o${i}`} transform={`translate(${OX} ${y})`}>
            {!reduced && outHits[i].map((t, k) => (
              <circle key={k} className="ha-flow-halo is-round" style={{ animationDelay: `${t}s` }} r="25" />
            ))}
            <circle r="25" className="ha-flow-out" filter="url(#haf-shadow)" />
            <g className="ha-flow-oico"><Icon k={OUT_ICON[i]} /></g>
          </g>
        ))}

        {/* travelling pulses */}
        {!reduced && PULSES.map((p, i) => {
          const fr = p.dur / T
          return (
            <g key={`p${i}`} opacity="0">
              <circle r="14" fill="url(#haf-glow)" />
              <path d="M-30 0H0" stroke="url(#haf-tail)" strokeWidth="4" strokeLinecap="round" />
              <circle r="4.4" fill="#b8860b" />
              <circle r="1.8" fill="#fff" opacity="0.9" />
              <animateMotion path={p.d} dur={`${T}s`} begin={`${p.start}s`} repeatCount="indefinite" rotate="auto"
                calcMode="spline" keyPoints="0;1;1" keyTimes={`0;${f(fr)};1`} keySplines="0.45 0 0.55 1;0 0 1 1" />
              <animate attributeName="opacity" dur={`${T}s`} begin={`${p.start}s`} repeatCount="indefinite"
                values="0;1;1;0;0" keyTimes={`0;${f(fr * 0.12)};${f(fr * 0.88)};${f(fr)};1`} />
            </g>
          )
        })}

        <g className="ha-flow-cols" textAnchor="middle">
          <text x={SX} y="452">DATA</text>
          <text x={AX} y="452">AGENTS</text>
          <text x={OX} y="452">OUTCOMES</text>
        </g>
      </svg>
    </div>
  )
}
