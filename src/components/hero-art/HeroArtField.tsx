'use client'

import { useEffect, useRef } from 'react'

/* A drifting constellation: nodes cluster around slowly orbiting centres, link with fading
   lines, respond to the pointer, and pass gold "signals" along edges. Canvas, DPR-aware. */

type P = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean; g: number; ph: number; w: number; flash: number }
type Sig = { a: number; b: number; t: number; dur: number; hops: number }

const INK = '7,16,24'
const OCHRE = '184,134,11'
const GOLD = '220,174,58'

function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export default function HeroArtField() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const rand = rng(20251)

    let w = 0, h = 0, dpr = 1, L = 130
    let ps: P[] = []
    let core: P
    const sigs: Sig[] = []
    let ptr: { x: number; y: number } | null = null
    let raf = 0, last = 0, time = 0, nextSig = 0.6
    let visible = true
    let edges: [number, number, number][] = []

    const init = () => {
      const rect = wrap.getBoundingClientRect()
      w = Math.max(1, rect.width); h = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.max(26, Math.min(64, Math.round((w * h) / 8200)))
      L = Math.max(92, Math.min(150, Math.min(w, h) * 0.26))
      ps = []
      for (let i = 0; i < n; i++) {
        ps.push({
          x: w / 2 + Math.cos(i * 2.4) * Math.sqrt(rand()) * w * 0.4, y: h / 2 + Math.sin(i * 2.4) * Math.sqrt(rand()) * h * 0.4, vx: 0, vy: 0,
          r: 1.6 + rand() * 1.6, hub: i % 9 === 0, g: i % 3, ph: rand() * 6.28, w: 0.25 + rand() * 0.35, flash: 0,
        })
        if (ps[i].hub) ps[i].r = 3.6
      }
      core = { x: w / 2, y: h / 2, vx: 0, vy: 0, r: 7, hub: true, g: -1, ph: 0, w: 0, flash: 0 }
      ps.push(core)
      sigs.length = 0
    }

    const centre = (g: number, t: number) => {
      const a = g * 2.094 + t * 0.07
      const rx = w * 0.24, ry = h * 0.24
      return { x: w / 2 + Math.cos(a + Math.sin(t * 0.13 + g) * 0.6) * rx, y: h / 2 + Math.sin(a * 1.3) * ry }
    }

    const step = (dt: number) => {
      time += dt
      const padX = Math.max(26, w * 0.06), padY = Math.max(26, h * 0.06)
      const cs = [centre(0, time), centre(1, time), centre(2, time)]
      const damp = Math.exp(-dt * 0.9)
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i]
        if (p === core) {
          p.x = w / 2 + Math.sin(time * 0.31) * w * 0.035
          p.y = h / 2 + Math.cos(time * 0.27) * h * 0.035
          p.flash *= Math.exp(-dt * 2.2)
          continue
        }
        const c = cs[p.g]
        let ax = (c.x - p.x) * 0.02, ay = (c.y - p.y) * 0.02
        const ang = time * p.w + p.ph
        ax += Math.cos(ang) * 18; ay += Math.sin(ang * 1.1) * 18
        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j]
          const dx = p.x - q.x, dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < 900 && d2 > 0.01) {
            const d = Math.sqrt(d2), f = ((30 - d) / 30) * 40
            ax += (dx / d) * f; ay += (dy / d) * f
            q.vx -= (dx / d) * f * dt; q.vy -= (dy / d) * f * dt
          }
        }
        if (ptr) {
          const dx = ptr.x - p.x, dy = ptr.y - p.y
          const d = Math.hypot(dx, dy)
          if (d < 170 && d > 0.1) {
            const f = d < 70 ? -((70 - d) / 70) * 160 : ((d - 70) / 100) * 38
            ax += (dx / d) * f; ay += (dy / d) * f
          }
        }
        const ex = (p.x - w / 2) / (w * 0.46), ey = (p.y - h / 2) / (h * 0.46), er = Math.hypot(ex, ey)
        if (er > 1) { const k = (er - 1) * 220 / er; ax -= ex * k; ay -= ey * k }
        if (p.x < padX) ax += (padX - p.x) * 1.4
        if (p.x > w - padX) ax -= (p.x - (w - padX)) * 1.4
        if (p.y < padY) ay += (padY - p.y) * 1.4
        if (p.y > h - padY) ay -= (p.y - (h - padY)) * 1.4
        p.vx = (p.vx + ax * dt) * damp; p.vy = (p.vy + ay * dt) * damp
        p.x += p.vx * dt; p.y += p.vy * dt
        p.flash *= Math.exp(-dt * 2.2)
      }
      // edges
      edges = []
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y
        const lim = i === ps.length - 1 || j === ps.length - 1 ? L * 1.45 : L
        const d = Math.hypot(dx, dy)
        if (d < lim) edges.push([i, j, 1 - d / lim])
      }
      // signals
      nextSig -= dt
      if (nextSig <= 0 && sigs.length < 6 && edges.length) {
        const pool = edges.filter((e) => e[2] > 0.25)
        const e = (pool.length ? pool : edges)[Math.floor(rand() * (pool.length || edges.length))]
        const fromCore = e[1] === ps.length - 1
        sigs.push({ a: fromCore ? e[1] : e[0], b: fromCore ? e[0] : e[1], t: 0, dur: 0.9 + rand() * 0.5, hops: 1 + Math.floor(rand() * 3) })
        nextSig = 0.5 + rand() * 0.7
      }
      for (let k = sigs.length - 1; k >= 0; k--) {
        const s = sigs[k]
        s.t += dt / s.dur
        if (s.t >= 1) {
          ps[s.b].flash = 1
          const nb = edges.filter((e) => (e[0] === s.b || e[1] === s.b) && e[0] !== s.a && e[1] !== s.a)
          if (s.hops > 1 && nb.length && rand() < 0.8) {
            const e = nb[Math.floor(rand() * nb.length)]
            s.a = s.b; s.b = e[0] === s.b ? e[1] : e[0]; s.t = 0; s.hops -= 1; s.dur = 0.7 + rand() * 0.4
          } else sigs.splice(k, 1)
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      ctx.lineWidth = 1
      for (const [i, j, k] of edges) {
        const a = ps[i], b = ps[j]
        const near = ptr && Math.hypot((a.x + b.x) / 2 - ptr.x, (a.y + b.y) / 2 - ptr.y) < 120
        ctx.strokeStyle = near ? `rgba(${OCHRE},${(0.12 + k * 0.5).toFixed(3)})` : `rgba(${INK},${(k * 0.26).toFixed(3)})`
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
      }
      if (ptr) {
        for (const p of ps) {
          const d = Math.hypot(p.x - ptr.x, p.y - ptr.y)
          if (d < 150) {
            ctx.strokeStyle = `rgba(${OCHRE},${((1 - d / 150) * 0.5).toFixed(3)})`
            ctx.beginPath(); ctx.moveTo(ptr.x, ptr.y); ctx.lineTo(p.x, p.y); ctx.stroke()
          }
        }
        const g = ctx.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 46)
        g.addColorStop(0, `rgba(${GOLD},.35)`); g.addColorStop(1, `rgba(${GOLD},0)`)
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ptr.x, ptr.y, 46, 0, 6.2832); ctx.fill()
        ctx.fillStyle = `rgba(${OCHRE},.9)`; ctx.beginPath(); ctx.arc(ptr.x, ptr.y, 2.6, 0, 6.2832); ctx.fill()
      }
      // core halo
      const pulse = 0.5 + 0.5 * Math.sin(time * 1.4)
      const cr = 46 + pulse * 10 + core.flash * 14
      const cg = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, cr)
      cg.addColorStop(0, `rgba(${GOLD},${(0.42 + core.flash * 0.25).toFixed(3)})`); cg.addColorStop(1, `rgba(${GOLD},0)`)
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(core.x, core.y, cr, 0, 6.2832); ctx.fill()
      for (const p of ps) {
        if (p === core) continue
        if (p.flash > 0.02) {
          ctx.strokeStyle = `rgba(${OCHRE},${(p.flash * 0.6).toFixed(3)})`
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r + (1 - p.flash) * 14, 0, 6.2832); ctx.stroke()
        }
        ctx.fillStyle = p.hub ? `rgba(${OCHRE},.95)` : `rgba(${INK},.72)`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + p.flash * 1.5, 0, 6.2832); ctx.fill()
        if (p.hub) { ctx.fillStyle = `rgba(${GOLD},.22)`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 6, 0, 6.2832); ctx.fill() }
      }
      ctx.fillStyle = '#b8860b'; ctx.beginPath(); ctx.arc(core.x, core.y, core.r, 0, 6.2832); ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(core.x, core.y, core.r - 1, 0, 6.2832); ctx.stroke()
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(core.x, core.y, 2.2, 0, 6.2832); ctx.fill()
      // signals
      for (const s of sigs) {
        const a = ps[s.a], b = ps[s.b]
        const e = ease(Math.min(1, s.t)), e0 = ease(Math.max(0, s.t - 0.22))
        const x = a.x + (b.x - a.x) * e, y = a.y + (b.y - a.y) * e
        const x0 = a.x + (b.x - a.x) * e0, y0 = a.y + (b.y - a.y) * e0
        const lg = ctx.createLinearGradient(x0, y0, x, y)
        lg.addColorStop(0, `rgba(${GOLD},0)`); lg.addColorStop(1, `rgba(${OCHRE},.9)`)
        ctx.strokeStyle = lg; ctx.lineWidth = 2.2
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke()
        const g = ctx.createRadialGradient(x, y, 0, x, y, 11)
        g.addColorStop(0, `rgba(${GOLD},.7)`); g.addColorStop(1, `rgba(${GOLD},0)`)
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.2832); ctx.fill()
        ctx.fillStyle = '#b8860b'; ctx.beginPath(); ctx.arc(x, y, 2.8, 0, 6.2832); ctx.fill()
        ctx.lineWidth = 1
      }
    }

    const frame = (now: number) => {
      raf = 0
      if (!visible || document.hidden) { last = 0; return }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
      last = now
      step(dt); draw()
      raf = requestAnimationFrame(frame)
    }
    const start = () => { if (!raf && !mq.matches && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame) } }
    const still = () => { for (let i = 0; i < 260; i++) step(1 / 30); sigs.length = 0; draw() }
    const rebuild = () => { init(); if (mq.matches) still(); else { step(0.016); draw(); start() } }

    rebuild()
    const ro = new ResizeObserver(() => { rebuild() })
    ro.observe(wrap)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start() }, { threshold: 0.02 })
    io.observe(wrap)
    const onVis = () => { if (!document.hidden) start() }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      ptr = x >= 0 && y >= 0 && x <= r.width && y <= r.height ? { x, y } : null
    }
    const onLeave = () => { ptr = null }
    const onMq = () => { if (mq.matches) { cancelAnimationFrame(raf); raf = 0; still() } else start() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    mq.addEventListener('change', onMq)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      mq.removeEventListener('change', onMq)
    }
  }, [])

  return (
    <div ref={wrapRef} className="ha-field">
      <canvas ref={canvasRef} className="ha-field-canvas" />
    </div>
  )
}
