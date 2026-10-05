'use client';

import { useEffect, useRef } from 'react';
import { AiMark, HumanMark, STAGES, STAGE_ICON, clamp } from './EngineeringFlow';

/*
 * Engineering delivery loop around "P10 Intelligence" — a one-shot, choreographed sequence
 * (replayed each time the section scrolls into view) that ends in the calm, softly-lit static
 * composition.
 *
 *   0.0s  hub fades + scales in, ambient glow rises
 *   1.0s  a luminous pulse leaves Intent and travels clockwise, activating each stage
 *   5.3s  it slows to a stop on the Human Review marker (warm amber hold), then continues
 *   7.1s  Deploy activates
 *   7.7s  one last, softer pulse circles the whole loop
 *   11s   everything settles: six stages softly lit, hub glowing, camera back at 1.0
 *
 * No layout is animated — only transform/opacity and a few SVG stroke offsets. Every frame is a pure
 * function of the sequence time `t`, so the static (reduced-motion / off-screen) state is simply
 * draw(END).
 */
const N = STAGES.length;
const START_DEG = -120; // Intent sits upper-left; the flow runs clockwise
const NODE_P = STAGES.map((_, i) => i / N);
const CHECKPOINT_P = 4.5 / N; // between Verify and Deploy
const RESIDUAL = 0.4; // how softly each stage stays lit once reached

// Pass 1 keyframes: [time, progress around the ring, slope] — slope 0 = the pulse comes to rest there.
const T_INTRO = 1.0, T_DEPLOY = 7.1, T_LAP0 = 7.7, LAP_LEN = 2.3, T_LAP_END = T_LAP0 + LAP_LEN, T_SETTLE = 11.0;
const T1 = [1.0, 1.85, 2.7, 3.55, 4.4, T_DEPLOY]; // arrival at Intent … Deploy
const T_CP = 5.3, T_CP_LEAVE = 6.2; // Human Review: arrive, hold, leave
const KF: [number, number][] = [
  [T1[0], 0], [T1[1], 1 / N], [T1[2], 2 / N], [T1[3], 3 / N], [T1[4], 4 / N],
  [T_CP, CHECKPOINT_P], [T_CP_LEAVE, CHECKPOINT_P], [T1[5], 5 / N],
];
const SLOPE = KF.map(([t, p], i) => {
  if (i === 0 || i === KF.length - 1 || i === 5 || i === 6) return 0;
  const s0 = (p - KF[i - 1][1]) / (t - KF[i - 1][0]);
  const s1 = (KF[i + 1][1] - p) / (KF[i + 1][0] - t);
  return (s0 + s1) / 2;
});
function pass1(t: number) {
  if (t <= KF[0][0]) return 0;
  if (t >= KF[KF.length - 1][0]) return KF[KF.length - 1][1];
  let i = 0;
  while (t > KF[i + 1][0]) i++;
  const [ta, pa] = KF[i], [tb, pb] = KF[i + 1];
  const h = tb - ta, x = (t - ta) / h;
  const x2 = x * x, x3 = x2 * x;
  return (2 * x3 - 3 * x2 + 1) * pa + (x3 - 2 * x2 + x) * h * SLOPE[i] + (-2 * x3 + 3 * x2) * pb + (x3 - x2) * h * SLOPE[i + 1];
}

const ease = (v: number) => { const x = clamp(v, 0, 1); return x * x * x * (x * (6 * x - 15) + 10); };
const easeOut = (v: number) => 1 - Math.pow(1 - clamp(v, 0, 1), 3);
const lap = (t: number) => ease((t - T_LAP0) / LAP_LEN); // final lap progress 0..1

// When the final lap crosses each stage (solved once).
const T2 = NODE_P.map((p) => {
  if (p === 0) return Infinity;
  let lo = 0, hi = 1;
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (ease(m) < p) lo = m; else hi = m; }
  return T_LAP0 + LAP_LEN * lo;
});

// glow shape after an arrival: quick rise, slow fall
const shape = (a: number) => (a < 0 ? 0 : a < 0.22 ? ease(a / 0.22) : 1 - ease((a - 0.22) / 1.2));

const ang = (p: number) => ((START_DEG + p * 360) * Math.PI) / 180;

export default function EngineeringCycle({ label }: { label?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const all = <T extends Element>(n: string) => Array.from(root.querySelectorAll<T>(`[data-ef="${n}"]`));
    const one = <T extends Element>(n: string) => root.querySelector<T>(`[data-ef="${n}"]`)!;
    const nodes = all<HTMLElement>('node'), rings = all<HTMLElement>('ring'), badges = all<HTMLElement>('badge');
    const lits = all<HTMLElement>('lit'), ripples = all<HTMLElement>('ripple'), labels = all<HTMLElement>('label');
    const spokes = all<SVGLineElement>('spoke'), flows = all<SVGLineElement>('flow');
    const parts = all<SVGCircleElement>('part');
    const cam = one<HTMLElement>('cam'), svg = one<SVGSVGElement>('svg');
    const hub = one<HTMLElement>('hub'), hubGlow = one<HTMLElement>('hubglow'), hubRing = one<HTMLElement>('hubring');
    const orbit = one<SVGCircleElement>('orbit'), tail = one<SVGCircleElement>('tail'), tailWide = one<SVGCircleElement>('tailwide');
    const head = one<SVGCircleElement>('head'), headGlow = one<SVGCircleElement>('headglow');
    const cp = one<HTMLElement>('cp'), cpRing = one<HTMLElement>('cpring'), cpDot = one<HTMLElement>('cpdot'), cpLabel = one<HTMLElement>('cplabel');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cx = 0, cy = 0, R = 150, DOT = 46, hubR = 80;
    let raf = 0, last = 0, t = 0;

    const measure = () => {
      const W = root.clientWidth;
      DOT = W < 480 ? 36 : W < 900 ? 40 : 46;
      R = Math.min(W >= 680 ? 190 : 150, W / 2 - (W >= 680 ? 70 : 62));
      hubR = Math.round(R * 0.5);
      const H = 2 * (0.866 * R + DOT / 2 + 40);
      root.style.height = `${H}px`;
      root.style.setProperty('--dot', `${DOT}px`);
      cx = W / 2; cy = H / 2;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('width', String(W)); svg.setAttribute('height', String(H));
      orbit.setAttribute('cx', String(cx)); orbit.setAttribute('cy', String(cy)); orbit.setAttribute('r', String(R));
      [tail, tailWide].forEach((c) => {
        c.setAttribute('cx', String(cx)); c.setAttribute('cy', String(cy)); c.setAttribute('r', String(R));
        c.setAttribute('transform', `rotate(${START_DEG} ${cx} ${cy})`);
      });
      nodes.forEach((n, i) => {
        const a = ang(NODE_P[i]);
        n.style.transform = `translate3d(${cx + R * Math.cos(a)}px,${cy + R * Math.sin(a)}px,0)`;
        const r0 = hubR + 16, r1 = R - DOT / 2 - 5;
        [spokes[i], flows[i]].forEach((l) => {
          l.setAttribute('x1', String(cx + Math.cos(a) * r0)); l.setAttribute('y1', String(cy + Math.sin(a) * r0));
          l.setAttribute('x2', String(cx + Math.cos(a) * r1)); l.setAttribute('y2', String(cy + Math.sin(a) * r1));
        });
      });
      const ca = ang(CHECKPOINT_P);
      cp.style.transform = `translate3d(${cx + R * Math.cos(ca)}px,${cy + R * Math.sin(ca)}px,0)`;
      hub.style.width = hub.style.height = `${hubR * 2}px`;
      hub.style.left = `${cx - hubR}px`; hub.style.top = `${cy - hubR}px`;
      hubRing.style.width = hubRing.style.height = `${hubR * 2 + 28}px`;
      hubRing.style.left = `${cx - hubR - 14}px`; hubRing.style.top = `${cy - hubR - 14}px`;
      hubGlow.style.width = hubGlow.style.height = `${hubR * 2 + 80}px`;
      hubGlow.style.left = `${cx - hubR - 40}px`; hubGlow.style.top = `${cy - hubR - 40}px`;
    };

    const setPulse = (p: number, tailLen: number, alpha: number, soft: number) => {
      const a = ang(p);
      const pos = (q: number) => { const b = ang(q); return [cx + R * Math.cos(b), cy + R * Math.sin(b)]; };
      const start = ((p - tailLen) * 1000) % 1000;
      const dash = `${tailLen * 1000} ${1000 - tailLen * 1000}`;
      tail.setAttribute('stroke-dasharray', dash); tailWide.setAttribute('stroke-dasharray', dash);
      tail.setAttribute('stroke-dashoffset', String(-start)); tailWide.setAttribute('stroke-dashoffset', String(-start));
      tail.style.opacity = String((alpha * 0.85 * soft).toFixed(3));
      tailWide.style.opacity = String((alpha * 0.16 * soft).toFixed(3));
      const [hx, hy] = pos(p);
      head.setAttribute('cx', hx.toFixed(2)); head.setAttribute('cy', hy.toFixed(2));
      headGlow.setAttribute('cx', hx.toFixed(2)); headGlow.setAttribute('cy', hy.toFixed(2));
      head.style.opacity = String((alpha * soft).toFixed(3));
      headGlow.style.opacity = String((alpha * 0.22 * soft).toFixed(3));
      parts.forEach((c, j) => {
        const [px, py] = pos(p - 0.02 * (j + 1));
        c.setAttribute('cx', px.toFixed(2)); c.setAttribute('cy', py.toFixed(2));
        c.style.opacity = String((alpha * soft * [0.6, 0.38, 0.2][j]).toFixed(3));
      });
      void a;
    };

    const draw = (time: number) => {
      // camera: barely-there push-in across the sequence, easing back to rest at the end
      const push = time < 10 ? ease((time - 0.5) / 9.5) : 1 - ease((time - 10) / (T_SETTLE - 10));
      cam.style.transform = `scale(${(1 + 0.025 * push).toFixed(4)})`;

      // hub: fades and scales into place, then holds a soft glow
      const hi = easeOut(time / 1.0);
      let act = 0;
      const seq = ease((time - 1.1) / 0.6) * (1 - ease((time - (T_LAP_END + 0.3)) / 0.7)); // ambient flow window
      STAGES.forEach((_, k) => {
        const a1 = time - T1[k], a2 = time - T2[k];
        const s1 = shape(a1), s2 = 0.55 * shape(a2);
        const resid = RESIDUAL * ease((time - T1[k]) / 0.6);
        const g = Math.max(resid, s1, s2);
        const pr = Math.max(s1, s2 / 0.55 * 0.6);
        act += Math.max(s1, s2);

        rings[k].style.opacity = String((0.14 + g * 0.86).toFixed(3));
        rings[k].style.transform = `scale(${(1 + g * 0.5).toFixed(3)})`;
        lits[k].style.opacity = g.toFixed(3);
        if (badges[k]) { badges[k].style.opacity = String((0.16 + g * 0.84).toFixed(3)); badges[k].style.transform = `scale(${(1 + g * 0.28).toFixed(3)})`; }
        labels[k].style.transform = `translateX(-50%) scale(${(1 + 0.08 * pr).toFixed(3)})`;

        // ripple leaving the icon
        const u1 = a1 / 1.1, u2 = a2 / 1.1;
        const ro = Math.max(u1 >= 0 && u1 <= 1 ? 0.5 * (1 - u1) : 0, u2 >= 0 && u2 <= 1 ? 0.28 * (1 - u2) : 0);
        const ru = u1 >= 0 && u1 <= 1 ? u1 : u2 >= 0 && u2 <= 1 ? u2 : 0;
        ripples[k].style.opacity = ro.toFixed(3);
        ripples[k].style.transform = `scale(${(1 + 0.85 * easeOut(ru)).toFixed(3)})`;

        // intelligence flowing between the hub and the stage
        const f1 = (time - (T1[k] - 0.35)) / 0.7, f2 = (time - (T2[k] - 0.35)) / 0.7;
        const flare = f1 >= 0 && f1 <= 1 ? { s: ease(f1), o: 0.9 * Math.sin(Math.PI * f1) } : f2 >= 0 && f2 <= 1 ? { s: ease(f2), o: 0.5 * Math.sin(Math.PI * f2) } : null;
        const cyc = (time * 0.42 + k * 0.37) % 1;
        const cs = k % 2 ? 1 - cyc : cyc;
        const ambient = 0.3 * seq * Math.sin(Math.PI * cyc);
        const s = flare ? flare.s : cs;
        const o = Math.max(ambient, flare ? flare.o : 0);
        const off = s * 116 - 16;
        flows[k].setAttribute('stroke-dashoffset', (-off).toFixed(2));
        flows[k].style.opacity = o.toFixed(3);
      });

      hub.style.opacity = hi.toFixed(3);
      hub.style.transform = `scale(${(0.94 + 0.06 * hi).toFixed(4)})`;
      hubRing.style.opacity = hi.toFixed(3);
      hubGlow.style.opacity = String((hi * (0.5 + Math.min(1, act) * 0.35)).toFixed(3));
      hubGlow.style.transform = `scale(${(0.9 + 0.1 * hi + Math.min(1, act) * 0.04).toFixed(3)})`;

      // Human Review: warm amber hold
      const amber = ease((time - (T_CP - 0.5)) / 0.5) * (1 - ease((time - (T_CP_LEAVE + 0.1)) / 0.9));
      cpRing.style.opacity = String((0.16 + amber * 0.84).toFixed(3));
      cpRing.style.transform = `translate(-50%,-50%) scale(${(1 + amber * 0.6).toFixed(3)})`;
      cpDot.style.transform = `scale(${(1 + amber * 0.16).toFixed(3)})`;
      cpDot.style.boxShadow = amber > 0.02
        ? `0 0 0 ${(amber * 4).toFixed(1)}px rgba(184,134,11,${(0.16 * amber).toFixed(3)}),0 0 ${(18 * amber).toFixed(1)}px rgba(214,150,40,${(0.4 * amber).toFixed(3)})`
        : 'none';
      cpDot.style.borderColor = amber > 0.02 ? `rgba(184,134,11,${(0.25 + 0.75 * amber).toFixed(3)})` : '';
      cpLabel.style.color = amber > 0.02 ? `color-mix(in srgb, var(--ochre) ${(amber * 100).toFixed(0)}%, #000)` : '';

      // luminous pulse: pass 1 (with a slow-down at Human Review), then one soft lap
      if (time >= T_INTRO && time <= T_DEPLOY + 0.5) {
        const alpha = ease((time - T_INTRO) / 0.25) * (1 - ease((time - T_DEPLOY) / 0.5));
        setPulse(pass1(time), 0.075, alpha, 1);
      } else if (time >= T_LAP0 && time <= T_LAP_END + 0.3) {
        const alpha = ease((time - T_LAP0) / 0.3) * (1 - ease((time - T_LAP_END) / 0.3));
        setPulse(lap(time), 0.12, alpha, 0.6);
      } else {
        setPulse(0, 0.05, 0, 0);
      }
    };

    const tick = (now: number) => {
      t += Math.min(0.05, (now - last) / 1000);
      last = now;
      if (t >= T_SETTLE) { draw(T_SETTLE); pause(); return; }
      draw(t);
      raf = requestAnimationFrame(tick);
    };
    const play = () => { if (raf || reduced) return; t = 0; last = performance.now(); raf = requestAnimationFrame(tick); };
    const pause = () => { cancelAnimationFrame(raf); raf = 0; };

    measure();
    draw(T_SETTLE); // the calm static composition until the section is seen
    const ro = new ResizeObserver(() => { measure(); draw(raf ? t : T_SETTLE); });
    ro.observe(root);
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) play(); else { pause(); draw(T_SETTLE); } }, { threshold: 0.4 });
    io.observe(root);
    return () => { pause(); io.disconnect(); ro.disconnect(); };
  }, []);

  return (
    <div
      ref={rootRef}
      className="ecyc"
      role="img"
      aria-label={
        label ||
        'P10 Intelligence at the centre of a continuous engineering loop: intent, specification, build, test and verify, with a human review checkpoint before deploy, and AI embedded at every stage'
      }
    >
      <div data-ef="cam" className="ecyc-cam">
        <svg data-ef="svg" className="ecyc-svg" aria-hidden="true">
          <circle data-ef="orbit" className="ecyc-orbit" />
          <circle data-ef="tailwide" className="ecyc-tail wide" pathLength={1000} />
          <circle data-ef="tail" className="ecyc-tail" pathLength={1000} />
          {STAGES.map((s) => (<line key={s.key} data-ef="spoke" className="ecyc-spoke" />))}
          {STAGES.map((s) => (<line key={s.key} data-ef="flow" className="ecyc-flow" pathLength={100} strokeDasharray="16 200" />))}
          <circle data-ef="headglow" className="ecyc-headglow" r={11} />
          {[0, 1, 2].map((j) => (<circle key={j} data-ef="part" className="ecyc-part" r={[2.4, 1.9, 1.4][j]} />))}
          <circle data-ef="head" className="ecyc-head" r={3.6} />
        </svg>

        <div data-ef="hubglow" className="ecyc-hubglow" aria-hidden="true" />
        <div data-ef="hubring" className="ecyc-hubring" aria-hidden="true" />
        <div data-ef="hub" className="ecyc-hub" aria-hidden="true">
          <span className="ecyc-hub-name">P10</span>
          <span className="ecyc-hub-sub">Intelligence</span>
        </div>

        {STAGES.map((s, i) => {
          const above = Math.sin(ang(i / N)) < -0.05;
          return (
            <div key={s.key} data-ef="node" className={`ecyc-node tone-${s.tone}`} aria-hidden="true">
              <span data-ef="ring" className="ecyc-ring" />
              <span data-ef="ripple" className="ecyc-ripple" />
              <span className="ecyc-dot">
                <span data-ef="lit" className="ecyc-lit" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{STAGE_ICON[s.key]}</svg>
              </span>
              {s.badge && (<span data-ef="badge" className="ecyc-badge" title="AI-assisted"><AiMark /></span>)}
              <span data-ef="label" className={`ecyc-label ${above ? 'up' : 'down'}`}>{s.label}</span>
            </div>
          );
        })}

        <div className="ecyc-cp" data-ef="cp" aria-hidden="true" title="Human review — a person signs off before anything ships">
          <span data-ef="cpring" className="eflow-ring ecyc-cpring" />
          <span data-ef="cpdot" className="eflow-checkpoint-dot"><HumanMark /></span>
          <span data-ef="cplabel" className="ecyc-cp-label">Human review</span>
        </div>
      </div>
    </div>
  );
}
