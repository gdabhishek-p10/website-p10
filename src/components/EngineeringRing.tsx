'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AiMark, STAGE_ICON } from './EngineeringFlow';
import { Scene, STATUS, TITLES } from './EngineScenes';
import Platform, { PCX, PCY, PH, PW, calloutGeom, iconPos } from './EnginePlatform';

/*
 * The P10 delivery platform, one stage at a time — each stage opens as a working window.
 *
 * A raised cream-and-gold platform (see EnginePlatform) assembles around the P10 core. For each of the
 * six stages the matching segment lifts and glows, a signal runs from the core to it, its callout fades
 * in beside the platform, and a wide window grows out of the segment while the platform dims behind it.
 * A short AI-driven scene plays inside (chat → plan → the dashboard taking shape → quality check with a fix →
 * launch → live performance), then the window shrinks back into its segment. After Observe the whole platform glows
 * softly and holds; the glow eases off and the loop restarts with the platform still in place.
 * Interactive: it plays on its own; a segment opens that stage's window, which plays once, and its ✕ closes it
 * and carries on the tour from the next stage. Under
 * reduced motion an opened stage is shown fully played and static.
 * One story runs throughout: a live shipment dashboard for a logistics portal. The scene is a pure function of a looping clock `t`;
 * only opacity/transform/stroke offsets animate. Reduced motion shows the finished platform.
 */
const W = PW, H = PH;
// empty bands at the top and bottom of the virtual stage, trimmed so the animation sits close to its heading and the next section
const CROP = 85, CROP_BOTTOM = 50;
const ICONS: Record<string, ReactNode> = {
  intent: (<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.2 1.1 2.2h5c0-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3Z" /></>),
  spec: STAGE_ICON.spec,
  build: STAGE_ICON.build,
  qa: STAGE_ICON.verify,
  deploy: STAGE_ICON.deploy,
  observe: (<><rect x="4" y="12" width="4" height="8" rx="1" /><rect x="10" y="4" width="4" height="16" rx="1" /><rect x="16" y="9" width="4" height="11" rx="1" /></>),
};
const STAGES = [
  { key: 'intent', label: 'Intent', hint: 'You describe the feature', head: "Define the 'why'", body: 'Turn business goals into clear, actionable outcomes with AI' },
  { key: 'spec', label: 'Specification', hint: 'AI drafts the spec', head: 'Turn intent into design', body: 'AI-assisted requirements, architecture and planning' },
  { key: 'build', label: 'Build', hint: 'AI writes the code', head: 'Build faster', body: 'AI-native development, with intelligent copilots and reusable components' },
  { key: 'qa', label: 'QA', hint: 'AI tests and fixes itself', head: 'Assure at speed', body: 'AI-powered testing, security and quality checks' },
  { key: 'deploy', label: 'Deploy', hint: 'AI ships to production', head: 'Release with confidence', body: 'Automated deployments and AI-assisted change management' },
  { key: 'observe', label: 'Observe', hint: 'AI watches and learns', head: 'Learn and improve', body: 'Real-time insights, anomaly detection and continuous optimisation' },
];
const N = STAGES.length; // = SEGS
const DUR = [11.0, 7.4, 7.4, 10.8, 8.0, 10.4]; // seconds per stage — QA runs longest (tests, the AI self-fix, then review)
const START = DUR.map((_, i) => DUR.slice(0, i).reduce((a, b) => a + b, 0));
const T_FINAL = DUR.reduce((a, b) => a + b, 0); // finished platform holds from here
const LOOP = T_FINAL + 3.6;
const REDUCED_T = T_FINAL + 1.5;
const LEAD = 3.6; // first run only: the platform assembles and settles before the first stage begins
const C0 = 1.45; // step-local time at which the window has landed and its scene begins
type Mode = 'auto' | 'paused' | 'manual';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, s: number, d: number) => clamp((t - s) / d);
const ease = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };

export default function EngineeringRing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(-LEAD);
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState<Mode>('auto');
  const eng = useRef({ mode: 'auto' as Mode, stage: 0, clock: -LEAD, target: 0, reduced: false, looped: false });
  const go = useCallback((m: Mode) => { eng.current.mode = m; setMode(m); }, []);

  // Open one stage: it plays once from its node, then stays open until closed.
  const open = useCallback((m: number) => {
    const e = eng.current;
    e.stage = m;
    e.target = START[m] + DUR[m] - 1.05; // the moment just before the window would start to return
    e.clock = e.reduced ? e.target : START[m] + (m === 0 ? 0.7 : 0.45);
    go('manual');
    setT(e.clock);
  }, [go]);
  // Close the open window: it shrinks back into its node and the ring returns, then holds.
  const close = useCallback(() => {
    const e = eng.current;
    if (e.reduced) { go('auto'); setT(REDUCED_T); return; }
    const m = Math.max(0, START.filter((st) => e.clock >= st).length - 1);
    e.stage = m;
    e.target = START[m] + DUR[m] - 0.05;
    e.clock = Math.max(e.clock, START[m] + DUR[m] - 1.05);
    go('manual');
    setT(e.clock);
  }, [go]);
  // Play / pause. From a manually opened stage, play continues the tour with the stage after it.
  const toggle = useCallback(() => {
    const e = eng.current;
    if (e.mode === 'auto') { go('paused'); return; }
    if (e.mode === 'manual') {
      if (e.reduced) { go('auto'); setT(REDUCED_T); return; }
      e.clock = e.stage >= N - 1 ? T_FINAL : START[e.stage + 1];
      setT(e.clock);
    }
    go('auto');
  }, [go]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / W)));
    ro.observe(root);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      eng.current.reduced = true;
      setT(REDUCED_T);
      return () => ro.disconnect();
    }

    let raf = 0, last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      const e = eng.current;
      if (e.mode === 'auto') { e.clock += dt; if (e.clock >= LOOP) { e.clock -= LOOP; e.looped = true; } }
      else if (e.mode === 'manual' && e.clock < e.target) e.clock = Math.min(e.clock + dt, e.target);
      setT(e.clock);
    };
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (en.isIntersecting) raf = requestAnimationFrame(frame);
    }, { threshold: 0.15 });
    io.observe(root);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  const finale = t >= T_FINAL;
  const idx = finale ? N : Math.max(0, START.filter((st) => t >= st).length - 1);
  const si = Math.min(idx, N - 1);
  const dur = DUR[si];
  const s = finale ? 0 : t - START[si];
  const c = s - C0;

  // Platform: segments assemble at the start of the loop, the active one lifts and glows, visited ones
  // keep a warm tint. The platform dims while a window is open. Window: born at the active segment,
  // grows to fill the stage, then shrinks back into it.
  const intro = mode === 'manual' || eng.current.looped ? 99 : t + LEAD; // the platform only assembles on the first run
  const winIn = finale ? 0 : ease(prog(s, 0.8, 0.75));
  const winBack = finale ? 0 : ease(prog(s, dur - 1.0, 0.7));
  const winP = winIn * (1 - winBack); // 0 at the segment, 1 at the centre
  const winOp = Math.min(1, winIn * 4) * (1 - ease(prog(s, dur - 0.9, 0.55)));
  const platOp = finale ? 1 : 1 - 0.82 * winP; // the platform stays on screen between loops
  const appear = STAGES.map((_, i) => ease(prog(intro, 0.1 + i * 0.1, 0.6)));
  const act = STAGES.map((_, i) => {
    if (finale) return 0;
    const up = ease(prog(t, START[i] + 0.05, 0.5)), down = ease(prog(t, START[i] + DUR[i] - 0.1, 0.5));
    return up * (mode === 'manual' && i === si ? 1 : 1 - down);
  });
  const tint = STAGES.map((_, i) => (finale ? 1 - ease(prog(t, LOOP - 0.9, 0.8)) : ease(prog(t, START[i] + 0.4, 0.9)))); // the warm tint eases off just before the loop restarts
  const [ax, ay] = iconPos(si);
  const winX = ax + (PCX - ax) * winP, winY = ay + (PCY - 5 - ay) * winP;
  const stage = STAGES[si];
  const platLive = platOp > 0.3, winLive = winOp > 0.5;
  const sigP = finale ? 0 : prog(s, 0.1, 0.65);
  const callOp = finale ? 0 : ease(prog(s, 0.2, 0.5)) * (mode === 'manual' ? 1 : 1 - ease(prog(s, dur - 0.5, 0.4)));
  const cg = calloutGeom(si);

  return (
    <div className="er" ref={rootRef} style={{ height: (H - CROP - CROP_BOTTOM) * scale }} role="group"
      aria-label="Six stages of AI-driven delivery — intent, specification, build, QA, deploy and observe — following one shipment-dashboard feature for a logistics portal, from request to production. Select a stage to open it.">
      <div className="er-stage" style={{ width: W, height: H, transform: `scale(${scale}) translateY(-${CROP}px)` }}>
        <div className="er-layer" style={{ opacity: platOp, pointerEvents: platLive ? 'auto' : 'none' }}>
          <Platform
            icons={STAGES.map((st) => ICONS[st.key])} labels={STAGES.map((st) => st.label.toUpperCase())}
            ariaLabels={STAGES.map((st) => `${st.label}: ${st.hint}`)}
            appear={appear} act={act} tint={tint}
            cubeAppear={ease(prog(intro, 0, 0.7))} pulse={finale ? 0.5 + 0.5 * Math.sin(t * 3) : 0.35 + 0.25 * Math.sin(t * 2.2)}
            signal={finale ? null : { p: sigP, i: si, op: 1 - winP }}
            leader={finale ? null : { i: si, op: callOp * (1 - winP) }}
            live={platLive} onOpen={open} />
        </div>

        <div className={`er-call ${cg.left ? 'left' : 'right'}`} style={{ top: cg.y - 30, opacity: callOp }} aria-hidden>
          <b>{stage.head}</b><span>{stage.body}</span>
        </div>

        <div className={`ew s-${stage.key}`} style={{ left: winX, top: winY, opacity: winOp, pointerEvents: winLive ? 'auto' : 'none', transform: `translate(-50%,-50%) scale(${0.2 + 0.8 * winP})` }}>
          <div className="ew-bar">
            <span className="ew-hico" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">{ICONS[stage.key]}</svg>
            </span>
            <span className="ew-htitle" aria-hidden><b>{stage.label}</b><em>{TITLES[si]}</em></span>
            <span className="ew-right">
              <span className="ew-ai" aria-hidden><AiMark /><b>AI</b></span>
              <button type="button" className="ew-close" aria-label={`Close ${stage.label}`} tabIndex={winLive ? 0 : -1}
                onClick={(ev) => { ev.stopPropagation(); close(); setTimeout(toggle, 1100); }}>
                <svg viewBox="0 0 12 12" aria-hidden><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" /></svg>
              </button>
            </span>
          </div>
          <div aria-hidden style={{ display: 'contents' }}>
            <div className="ew-body"><Scene k={stage.key} c={c} /></div>
          </div>
          <div className="ew-status" aria-hidden>
            <span className="ew-stage"><i className="ew-sdot" />{stage.key === "deploy" && c >= 4.0 ? "Live — in use by your team" : STATUS[si]}</span>
            <span className="ew-seg">{STAGES.map((st, i) => <i key={st.key} className={i < idx ? 'done' : i === idx ? 'on' : ''} />)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
