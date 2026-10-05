'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

/*
 * "Write the spec. AI drives the rest."
 *
 * One dominant specification; an AI signal emerges from it, branches into architecture / code /
 * tests, converges through review into production. The scene is a pure function of a looping clock
 * `t` (seconds, 15s loop). Paths draw themselves (masked dotted strokes), signals travel along them,
 * everything else eases via CSS transitions. Reduced motion renders the finished state.
 *
 *   0–2   spec alone            2–4   AI scans the spec        4–7   signal branches, artifacts form
 *   7–10  artifacts complete, review approves     10–12  production goes live     12–15  hold, fade, loop
 */
const W = 1100, H = 740;
const LOOP = 15, T_FADE = 14.2, REDUCED_T = 13;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, s: number, d: number) => clamp((t - s) / d);
const ease = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };

type P = [number, number];
// Orthogonal paths with softly rounded corners, sampled densely so signals ride exactly on the line.
function route(pts: P[], r = 16): { d: string; pts: P[]; len: number[] } {
  const out: P[] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]];
    const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const k = Math.min(r, l1 / 2, l2 / 2);
    const p0: P = [b[0] + ((a[0] - b[0]) / l1) * k, b[1] + ((a[1] - b[1]) / l1) * k];
    const p1: P = [b[0] + ((c[0] - b[0]) / l2) * k, b[1] + ((c[1] - b[1]) / l2) * k];
    for (let n = 0; n <= 8; n++) {
      const u = n / 8, m = 1 - u;
      out.push([m * m * p0[0] + 2 * m * u * b[0] + u * u * p1[0], m * m * p0[1] + 2 * m * u * b[1] + u * u * p1[1]]);
    }
  }
  out.push(pts[pts.length - 1]);
  const len = [0];
  for (let i = 1; i < out.length; i++) len.push(len[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  return { d: 'M' + out.map((q) => q.join(' ')).join('L'), pts: out, len };
}
const at = (r: ReturnType<typeof route>, u: number): P => {
  const target = u * r.len[r.len.length - 1];
  let i = 1;
  while (i < r.len.length - 1 && r.len[i] < target) i++;
  const f = (target - r.len[i - 1]) / (r.len[i] - r.len[i - 1] || 1);
  return [r.pts[i - 1][0] + (r.pts[i][0] - r.pts[i - 1][0]) * f, r.pts[i - 1][1] + (r.pts[i][1] - r.pts[i - 1][1]) * f];
};

const SPEC_Y = 16, SPEC_H = 240, AI_Y = 284, CARD_Y = 398, CARD_H = 128, BUS_Y = 376, MERGE_Y = 552, VERIFY_Y = 574, PROD_Y = 656;
const XS = [200, 550, 900];
const PATHS = [
  { b: route([[550, 256], [550, AI_Y]]), s: 1.8, d: 0.5, ambient: 4.6 },
  { b: route([[550, 352], [550, BUS_Y], [XS[0], BUS_Y], [XS[0], CARD_Y]]), s: 4.3, d: 1.0, ambient: 5.4 },
  { b: route([[550, 352], [550, CARD_Y]]), s: 4.3, d: 0.7, ambient: 5.4 },
  { b: route([[550, 352], [550, BUS_Y], [XS[2], BUS_Y], [XS[2], CARD_Y]]), s: 4.3, d: 1.0, ambient: 5.4 },
  { b: route([[XS[0], CARD_Y + CARD_H], [XS[0], MERGE_Y], [550, MERGE_Y], [550, VERIFY_Y]]), s: 7.7, d: 1.0 },
  { b: route([[550, CARD_Y + CARD_H], [550, VERIFY_Y]]), s: 7.7, d: 0.7 },
  { b: route([[XS[2], CARD_Y + CARD_H], [XS[2], MERGE_Y], [550, MERGE_Y], [550, VERIFY_Y]]), s: 7.7, d: 1.0 },
  { b: route([[550, VERIFY_Y + 40], [550, PROD_Y]]), s: 9.9, d: 0.6 },
];

const ITEMS = ['Access', 'Roles', 'Audit'];
const ROW0 = 104, ROW_H = 36; // list rows inside the spec card
const CODE: string[] = ['createRole()', 'assignRole()', 'revokeRole()'];
const CODE_CH = 12;
const ARCH: P[] = [[62, 16], [148, 16], [38, 50], [122, 50]];
const ARCH_EDGES = [[0, 1], [0, 2], [0, 3], [1, 3], [2, 3]];

function Tick({ on }: { on: boolean }) {
  return (
    <span className={`sd-check${on ? ' on' : ''}`} aria-hidden>
      <svg viewBox="0 0 12 12"><path d="M2.4 6.3l2.4 2.4 4.8-5.2" /></svg>
    </span>
  );
}

function Artifact({ x, on, done, label, children }: { x: number; on: boolean; done: boolean; label: string; children: ReactNode }) {
  return (
    <div className={`sd-rise sd-art${on ? ' on' : ''}${done ? ' done' : ''}`} style={{ left: x - 125, top: CARD_Y, width: 250, height: CARD_H }}>
      <div className="sd-float" style={{ animationDelay: `${-x / 300}s` }}>
        <div className="sd-art-head"><span className="sd-label">{label}</span><Tick on={done} /></div>
        {children}
      </div>
    </div>
  );
}

export default function EngineeringSpec() {
  const rootRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [t, setT] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / W)));
    ro.observe(root);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(REDUCED_T);
      return () => ro.disconnect();
    }

    let raf = 0, last = 0, clock = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      clock = (clock + dt) % LOOP;
      setT(clock);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    }, { threshold: 0.15 });
    io.observe(root);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  const fade = 1 - ease(prog(t, T_FADE, 0.7));

  // scan through the spec (2.1 – 3.9s)
  const scan = prog(t, 2.3, 1.8);
  const scanY = scan * (SPEC_H + 60) - 60;
  const scanOp = Math.min(1, Math.sin(Math.PI * scan) * 3);
  const rowHit = (i: number) => scan > 0 && scan < 1 && Math.abs(scanY + 60 - (ROW0 + ROW_H * i + ROW_H / 2)) < 30;

  // artifacts
  const typed = Math.floor(prog(t, 5.7, 1.5) * CODE_CH * 3);
  const lineChars = (i: number) => clamp(typed - i * CODE_CH, 0, CODE_CH);
  const archOn = (i: number) => t >= 5.3 + i * 0.28;
  const testOn = (i: number) => t >= 6.0 + i * 0.25;

  const verifyOn = t >= 8.4, verified = t >= 9.2;
  const prodOn = t >= 10.3, live = t >= 11.2;
  const specActive = t >= 2 && t < 12;

  const signals = (pth: (typeof PATHS)[number], i: number) => {
    const us: number[] = [];
    const flight = prog(t, pth.s + 0.05, pth.d);
    if (flight > 0 && flight < 1) us.push(ease(flight));
    if (pth.ambient && t > pth.ambient && t < 11) us.push(((t - pth.ambient) * 0.4 + i * 0.13) % 1);
    return us.map((u, k) => {
      const [x, y] = at(pth.b, u);
      return (
        <g key={`${i}-${k}`} opacity={Math.min(1, u * 8, (1 - u) * 8)}>
          <circle cx={x} cy={y} r="9" fill="#0a8fbd" opacity=".14" />
          <circle cx={x} cy={y} r="3.6" fill="#0a8fbd" />
        </g>
      );
    });
  };

  return (
    <div className="sd" ref={rootRef} style={{ height: H * scale }} role="img"
      aria-label="Write the spec once: AI reads it and drives architecture, code, tests and review through to a live production release">
      <div className="sd-stage" style={{ width: W, height: H, transform: `scale(${scale})`, opacity: fade }} aria-hidden>
        <svg className="sd-lines" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            {PATHS.map((p, i) => (
              <mask key={i} id={`${uid}m${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                <path d={p.b.d} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" pathLength={1}
                  strokeDasharray="1 1" strokeDashoffset={1 - ease(prog(t, p.s, p.d))} />
              </mask>
            ))}
          </defs>
          {PATHS.map((p, i) => (
            <path key={i} d={p.b.d} fill="none" stroke="#8fa3ad" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 7" mask={`url(#${uid}m${i})`} />
          ))}
          {PATHS.map(signals)}
        </svg>

        {/* the specification — hero */}
        <div className={`sd-rise sd-spec${t >= 0.2 ? ' on' : ''}${specActive ? ' active' : ''}`} style={{ left: 340, top: SPEC_Y, width: 420, height: SPEC_H }}>
          <div className="sd-float" style={{ animationDelay: '-1s' }}>
            <div className="sd-spec-head">
              <span className="sd-label">Product spec</span>
            </div>
            <div className="sd-spec-title">Team permissions</div>
            <ul className="sd-spec-list">
              {ITEMS.map((s, i) => (
                <li key={s} className={rowHit(i) ? 'hit' : ''}><Tick on={t >= 0.7 + i * 0.3} /><span>{s}</span></li>
              ))}
            </ul>
            <div className="sd-scan" style={{ transform: `translateY(${scanY}px)`, opacity: scanOp }} />
          </div>
        </div>

        {/* AI — the connective intelligence */}
        <div className={`sd-ai${t >= 2.0 ? ' on' : ''}${t >= 2 && t < 4.2 ? ' think' : ''}`} style={{ left: 550 - 44, top: AI_Y, width: 88, height: 36 }}>✦ AI</div>
        <div className={`sd-ai-cap${t >= 2.3 ? ' on' : ''}`} style={{ left: 550 - 100, top: AI_Y + 42, width: 200 }}>Understanding spec</div>

        {/* generated artifacts */}
        <Artifact x={XS[0]} on={t >= 4.9} done={t >= 7.4} label="Architecture">
          <svg className="sd-arch" viewBox="0 0 210 66" width="210" height="66">
            {ARCH_EDGES.map(([a, b], i) => (
              <line key={i} x1={ARCH[a][0]} y1={ARCH[a][1]} x2={ARCH[b][0]} y2={ARCH[b][1]} stroke="#9fb2bb" strokeWidth="1.5" strokeDasharray="1 4" strokeLinecap="round" opacity={archOn(i + 1) ? 1 : 0} style={{ transition: 'opacity .5s' }} />
            ))}
            {ARCH.map(([x, y], i) => (
              <g key={i} opacity={archOn(i) ? 1 : 0} style={{ transition: 'opacity .5s' }}>
                <path d={`M${x} ${y - 11}L${x + 11} ${y}L${x} ${y + 11}L${x - 11} ${y}Z`} fill="#eef6fa" stroke="#7fbdd6" strokeWidth="1.3" strokeLinejoin="round" />
                <circle cx={x} cy={y} r="2.2" fill="#0a8fbd" />
              </g>
            ))}
          </svg>
        </Artifact>

        <Artifact x={XS[1]} on={t >= 5.3} done={t >= 7.6} label="Code">
          <pre className="sd-code">
            {CODE.map((s, i) => {
              const n = lineChars(i);
              return (
                <div key={s} className="sd-code-line">
                  <span className="sd-f">{s.slice(0, Math.min(n, 10))}</span><span className="sd-p">{s.slice(10, n)}</span>
                  {n > 0 && n < CODE_CH && <span className="sd-caret" />}
                </div>
              );
            })}
          </pre>
        </Artifact>

        <Artifact x={XS[2]} on={t >= 5.7} done={t >= 7.8} label="Validation">
          <div className="sd-val">
            {[0, 1, 2, 3].map((i) => <Tick key={i} on={testOn(i)} />)}
          </div>
          <div className={`sd-val-count${t >= 7.0 ? ' on' : ''}`}><b>{Math.round(ease(prog(t, 7.0, 0.9)) * 48)}/48</b> passing</div>
        </Artifact>

        {/* spec verified */}
        <div className={`sd-rise sd-review${verifyOn ? ' on' : ''}${verified ? ' ok' : ''}`} style={{ left: 550 - 92, top: VERIFY_Y, width: 184, height: 40 }}>
          <Tick on={verified} /><span>Spec verified</span>
        </div>

        {/* production — the payoff */}
        <div className={`sd-rise sd-prod${prodOn ? ' on' : ''}${live ? ' live' : ''}`} style={{ left: 550 - 130, top: PROD_Y, width: 260, height: 64 }}>
          <span className="sd-prod-icon">{live ? <span className="sd-live-dot" /> : <i className="sd-spin" />}</span>
          <span className="sd-prod-text"><small>Production</small><b>{live ? 'Live' : 'Deploying'}</b></span>
        </div>
      </div>
    </div>
  );
}
