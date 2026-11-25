'use client'

import { useEffect, useRef, useState } from 'react'

/* "An idea becomes a product": a dashboard assembles itself from floating layers (window,
   KPI cards, bars, chart, assistant chat, toast) while a cursor places things. 9s loop, CSS only. */

const W = 520
const H = 470
const BARS = [40, 62, 50, 84, 70, 104, 126]

export default function HeroArtBuild() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const measure = () => {
      const { width, height } = root.getBoundingClientRect()
      if (width && height) setScale(Math.min(width / W, height / H, 1.2))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    let visible = true
    const apply = () => setPaused(!visible || document.hidden)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; apply() }, { threshold: 0.05 })
    io.observe(root)
    document.addEventListener('visibilitychange', apply)
    return () => { ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', apply) }
  }, [])

  return (
    <div ref={rootRef} className={`ha-build${paused ? ' is-paused' : ''}${scale ? ' is-ready' : ''}`}>
      <div className="ha-build-scaler" style={{ transform: `translate(-50%,-50%) scale(${scale ?? 1})` }}>
        <div className="ha-build-stage">
          <div className="ha-build-glow" />

          {/* layer 1: window + KPIs + bars */}
          <div className="ha-build-layer l1">
            <div className="ha-build-win">
              <div className="ha-build-bar">
                <i /><i /><i />
                <span className="ha-build-search" />
                <span className="ha-build-av" />
              </div>
              <div className="ha-build-side">
                <b className="on" /><b /><b /><b />
              </div>
            </div>

            {[['Accuracy', '98%'], ['Faster', '3.2x'], ['Cost', '-41%']].map(([l, v], i) => (
              <div key={l} className={`ha-build-kpi k${i + 1}`}>
                <em>{l}</em>
                <strong>{v}</strong>
                <span className="ha-build-kspark" />
              </div>
            ))}

            <span className="ha-build-sk bt" />
            <div className="ha-build-bars">
              {BARS.map((h, i) => (
                <span key={i} className={`ha-build-b b${i + 1}${i === BARS.length - 1 ? ' hi' : ''}`} style={{ height: h }} />
              ))}
              <span className="ha-build-base" />
            </div>
          </div>

          {/* layer 2: chart panel */}
          <div className="ha-build-layer l2">
            <div className="ha-build-chart">
              <div className="ha-build-chead">
                <span>Revenue</span>
                <span className="ha-build-pill">+12%</span>
              </div>
              <svg viewBox="0 0 220 104" className="ha-build-plot" role="presentation">
                <defs>
                  <linearGradient id="hab-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#dcae3a" stopOpacity="0.34" />
                    <stop offset="1" stopColor="#dcae3a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="#e8ecee" strokeWidth="1" strokeDasharray="3 4">
                  <path d="M0 20H220M0 52H220M0 84H220" />
                </g>
                <path className="ha-build-area" d="M4 84C24 80 34 62 56 66S92 44 114 50S154 30 174 34S206 14 216 10V104H4Z" fill="url(#hab-area)" />
                <path className="ha-build-line" pathLength={1} d="M4 84C24 80 34 62 56 66S92 44 114 50S154 30 174 34S206 14 216 10" fill="none" stroke="#b8860b" strokeWidth="2.6" strokeLinecap="round" />
                <g className="ha-build-dot">
                  <circle className="ha-build-ping" cx="216" cy="10" r="5" fill="#dcae3a" />
                  <circle cx="216" cy="10" r="4.4" fill="#fff" stroke="#b8860b" strokeWidth="2.2" />
                </g>
              </svg>
            </div>
          </div>

          {/* layer 3: assistant */}
          <div className="ha-build-layer l3">
            <div className="ha-build-chat">
              <div className="ha-build-chat-h">
                <span className="ha-build-spark">
                  <svg viewBox="-10 -10 20 20" width="12" height="12"><path fill="#fff" d="M0 -8.5C1 -3.5 3.5 -1 8.5 0C3.5 1 1 3.5 0 8.5C-1 3.5 -3.5 1 -8.5 0C-3.5 -1 -1 -3.5 0 -8.5z" /></svg>
                </span>
                <span>Assistant</span>
              </div>
              <div className="ha-build-ub">Forecast next quarter</div>
              <div className="ha-build-ab">
                <span className="ha-build-dots"><i /><i /><i /></span>
                <span className="ha-build-reply"><span>Up 12%, on track</span></span>
              </div>
            </div>
          </div>

          {/* layer 4: toast */}
          <div className="ha-build-layer l4">
            <div className="ha-build-toast">
              <span className="ha-build-tick">
                <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span>Shipped</span>
            </div>
          </div>

          <span className="ha-build-ripple r1" />
          <span className="ha-build-ripple r2" />
          <svg className="ha-build-cursor" viewBox="0 0 24 24" width="24" height="24">
            <path d="M2.5 2l7.8 19 2.6-8 8-2.6z" fill="#071018" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
