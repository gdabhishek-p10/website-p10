'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/*
 * Continuous, looping engineering-delivery flow: Intent → Specification → Build →
 * Test → Verify → Deploy. A small artifact travels the line, changing icon at
 * each stage — requirement, spec, code, test, verification, deployment — and a
 * node glows and its AI badge flashes the moment the artifact reaches it, with a
 * short caption occasionally surfacing what just happened ("AI implements the
 * code"). AI shows up at five of the six stages (spread through the pipeline,
 * not one central "AI" node); the one deliberate human gate sits on its own
 * small checkpoint between Verify and Deploy. Everything is a pure function of
 * the loop time `t`, driven by rAF, and pauses off-screen / under reduced motion.
 *
 * Layout is fraction-based (0..1 of the container), not pixel-measured, so no
 * ResizeObserver is needed — the six nodes sit at the centres of six equal flex
 * columns (fractions 1/12, 3/12, … 11/12), matching the CSS in styles.css.
 */
const LOOP = 11; // seconds per token lap
const SPEED = 0.62; // wall-clock multiplier — <1 slows the whole loop down uniformly
const REST = 4.6; // frame shown under prefers-reduced-motion
const NODE_FRACS = [1 / 12, 3 / 12, 5 / 12, 7 / 12, 9 / 12, 11 / 12]; // node centres, as a fraction of .eflow's width
const NODE_P = [0, 0.2, 0.4, 0.6, 0.8, 1]; // the same nodes, in token lap-progress space
const CHECKPOINT_P = 0.9; // human-review gate, sitting between Verify (0.8) and Deploy (1.0)
const AMP_PX = 8; // vertical wave amplitude
const EPS = 0.065; // how close (in lap-progress) a token must be to "arrive"
const MIN_GAP = 4.4; // minimum seconds between caption triggers on the same node
const TOKEN_DELAYS = [0]; // a single artifact per lap, so the sequence reads left-to-right, one stage at a time

type StageKey = 'intent' | 'spec' | 'build' | 'test' | 'verify' | 'deploy';

export type Stage = {
  key: StageKey;
  label: string;
  badge?: 'ai';
  caption?: string;
  tone: 'n1' | 'n2' | 'blue' | 'ochre';
};

// AI shows up at every stage except Intent (the human-authored ask) — spread
// through the pipeline rather than one central "AI" element — while the one
// explicit human checkpoint sits between Verify and Deploy (see CHECKPOINT_P).
export const STAGES: Stage[] = [
  { key: 'intent', label: 'Intent', tone: 'n1' },
  { key: 'spec', label: 'Specification', badge: 'ai', caption: 'AI drafts the spec', tone: 'n2' },
  { key: 'build', label: 'Build', badge: 'ai', caption: 'AI implements the code', tone: 'blue' },
  { key: 'test', label: 'Test', badge: 'ai', caption: '18/18 tests passing', tone: 'blue' },
  { key: 'verify', label: 'Verify', badge: 'ai', caption: 'AI validates the results', tone: 'ochre' },
  { key: 'deploy', label: 'Deploy', badge: 'ai', caption: 'AI monitors rollout', tone: 'ochre' },
];

export const STAGE_ICON: Record<StageKey, ReactNode> = {
  intent: <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H12l-3.5 3.5V16H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />,
  spec: (
    <>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M8.5 12h7M8.5 15.5h5" />
    </>
  ),
  build: <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />,
  test: (
    <>
      <path d="M9 2.5h6M10 3v5.2L5.6 16a2 2 0 0 0 1.7 3h9.4a2 2 0 0 0 1.7-3L14 8.2V3" />
      <path d="M7.5 14h9" />
    </>
  ),
  verify: (
    <>
      <path d="M12 3.5 5 6v5.2c0 4.3 3 7 7 9.3 4-2.3 7-5 7-9.3V6l-7-2.5Z" />
      <path d="M9 12.2l2 2 4-4.4" />
    </>
  ),
  deploy: (
    <>
      <path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.6 4.7 4.7 0 0 1 17.5 18H14" />
      <path d="M12 11v8M9.3 15.7 12 13l2.7 2.7" />
    </>
  ),
};

// A tiny skeleton bar, reusing the same .et-sk look the other animation's mini
// cards use, so both animations share one visual language.
const bar = (w: string, dark = false) => <span className={`et-sk${dark ? ' d' : ''}`} style={{ width: w }} />;

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, color: 'var(--blue)', flex: '0 0 auto' }}>
      <path d="M4.5 12.5 9 17l10.5-10.5" />
    </svg>
  );
}

// What actually flashes into view above each node when the artifact arrives —
// a small, stage-appropriate UI fragment (prompt box, doc, code, tests,
// approval, rollout), not just an icon. Built from the same .et-* classes as
// the "Legacy systems" animation's mini cards.
export const STAGE_CARD: Record<StageKey, ReactNode> = {
  intent: (
    <>
      <div className="et-row">{bar('40%', true)}</div>
      <div className="et-row">{bar('82%')}</div>
      <div className="et-row">
        <span className="et-btn">Send</span>
      </div>
    </>
  ),
  spec: (
    <>
      <div className="et-row">{bar('55%', true)}</div>
      <div className="et-row">{bar('90%')}</div>
      <div className="et-row">{bar('76%')}</div>
      <div className="et-row">
        <span className="et-tag on">AI drafted</span>
      </div>
    </>
  ),
  build: (
    <>
      <div className="et-row" style={{ gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e6635a', display: 'inline-block' }} />
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e3b23c', display: 'inline-block' }} />
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3fae6a', display: 'inline-block' }} />
      </div>
      <div className="et-row">{bar('38%', true)}</div>
      <div className="et-row" style={{ paddingLeft: 12 }}>
        {bar('60%')}
      </div>
      <div className="et-row" style={{ paddingLeft: 12, marginBottom: 0 }}>
        {bar('46%')}
      </div>
    </>
  ),
  test: (
    <>
      <div className="et-row">
        <CheckIcon />
        {bar('64%')}
      </div>
      <div className="et-row">
        <CheckIcon />
        {bar('50%')}
      </div>
      <div className="et-row" style={{ marginBottom: 0 }}>
        <span className="et-tag on">18/18 passing</span>
      </div>
    </>
  ),
  verify: (
    <>
      <div className="et-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="et-icon">
          {STAGE_ICON.verify}
        </svg>
        <div className="et-stack">{bar('58%', true)}</div>
        <span className="et-badge">2</span>
      </div>
      <div className="et-row" style={{ marginBottom: 0 }}>
        <span className="et-btn">Approve</span>
        <span className="et-btn ghost">Review</span>
      </div>
    </>
  ),
  deploy: (
    <>
      <div className="et-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" className="et-icon">
          {STAGE_ICON.deploy}
        </svg>
        <div className="et-stack">{bar('54%', true)}</div>
      </div>
      <div className="et-meter">
        <i style={{ width: '100%' }} />
      </div>
      <div className="et-row" style={{ marginBottom: 0 }}>
        <span className="et-tag on">Live</span>
      </div>
    </>
  ),
};

export function AiMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />
      <path d="M18 12l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </svg>
  );
}

export function HumanMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7.5" r="2.6" />
      <path d="M4 18c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6" />
      <path d="m14.5 12.5 2 2 4-4.2" />
    </svg>
  );
}

// Builds the wavy connector once: a smooth quadratic curve through all six node
// points, crossing the centreline (viewBox y=50) exactly at each node and
// bulging gently — up, then down, alternating — between them. The SVG's CSS
// band is 28px tall (see .eflow-svg), so a target midpoint bulge of `BULGE`
// viewBox units works out to roughly BULGE/100*28px on screen.
function buildPath(): string {
  const W = 1000;
  const BULGE = 32; // viewBox units (~9px on screen)
  // Quadratic bezier midpoint = 0.25*P0 + 0.5*C + 0.25*P2; solve C for a given
  // midpoint value when P0 = P2 = 50 (baseline).
  const controlY = (target: number) => 25 + (target - 50) * 2;
  let d = `M${NODE_FRACS[0] * W} 50`;
  for (let i = 0; i < NODE_FRACS.length - 1; i++) {
    const x0 = NODE_FRACS[i] * W;
    const x1 = NODE_FRACS[i + 1] * W;
    const sign = i % 2 === 0 ? -1 : 1;
    d += `Q${(x0 + x1) / 2} ${controlY(50 + sign * BULGE)} ${x1} 50`;
  }
  return d;
}
const LINE_D = buildPath();

export const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
// Plain (non-wrapping) distance: Intent (0) and Deploy (1) are the two ends of
// a straight line, not adjacent points on a ring, so proximity must not wrap
// around — otherwise Deploy would falsely "light up" the instant a lap resets.
const dist = (a: number, b: number) => Math.abs(a - b);
// Normalized wave offset in [-1, 1] for lap-progress p (0 at every node).
function waveVal(p: number) {
  const s = clamp(Math.floor(p * 5), 0, 4);
  const u = p * 5 - s;
  const sign = s % 2 === 0 ? -1 : 1;
  return 4 * u * (1 - u) * sign;
}
function tokenX(p: number) {
  return NODE_FRACS[0] + p * (NODE_FRACS[5] - NODE_FRACS[0]);
}
const CHECKPOINT_LEFT = tokenX(CHECKPOINT_P) * 100; // percent
const CHECKPOINT_TOP_OFFSET = waveVal(CHECKPOINT_P) * AMP_PX; // px, relative to --line-y

function edgeFade(p: number) {
  return Math.min(smoothstep(0, 0.04, p), 1 - smoothstep(0.96, 1, p));
}
// Caption visibility envelope relative to its trigger time (seconds elapsed).
export function captionEnv(age: number) {
  if (age < 0 || age > 1.8) return 0;
  if (age < 0.3) return age / 0.3;
  if (age < 1.3) return 1;
  return 1 - (age - 1.3) / 0.5;
}

export default function EngineeringFlow({ label }: { label?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const all = <T extends Element>(name: string) => Array.from(root.querySelectorAll<T>(`[data-ef="${name}"]`));
    const tokens = all<HTMLElement>('token');
    const tokenIcons = tokens.map((t) => Array.from(t.querySelectorAll<HTMLElement>('[data-icon]')));
    const rings = all<HTMLElement>('ring');
    const badges = all<HTMLElement>('badge');
    const flashcards = all<HTMLElement>('flashcard');

    const checkpointRing = all<HTMLElement>('cpring')[0];
    const checkpointDot = all<HTMLElement>('cpdot')[0];
    const checkpointCaption = all<HTMLElement>('cpcaption')[0];

    const checkpointState = { above: false, trigger: -10, lastTrigger: -10 };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = 0;
    let t = 0;

    const draw = (time: number) => {
      const end = 1; // reserved for future intro/outro; kept for symmetry with sibling animation

      // Nodes: glow from proximity to the nearest token, badge flash on arrival, captions on trigger.
      STAGES.forEach((s, k) => {
        const f = NODE_P[k]; // lap-progress, not NODE_FRACS (a container x-position) — different scales
        let glow = 0;
        TOKEN_DELAYS.forEach((delay) => {
          const p = (((time - delay * LOOP) % LOOP) + LOOP) % LOOP / LOOP;
          const g = clamp(1 - dist(p, f) / EPS, 0, 1);
          if (g > glow) glow = g;
        });

        const ring = rings[k];
        ring.style.opacity = String((0.14 + glow * 0.86) * end);
        ring.style.transform = `translate(-50%,-50%) scale(${1 + glow * 0.55})`;

        const badge = badges[k];
        if (badge) {
          badge.style.opacity = String((0.16 + glow * 0.84) * end);
          badge.style.transform = `scale(${1 + glow * 0.32})`;
        }

        // The flash-card tracks glow directly (eased) rather than a separate
        // timed trigger, so it's tightly bound to the artifact actually being
        // at that stage — rising as it approaches, peaking on arrival, easing
        // back down as it moves on.
        const flash = flashcards[k];
        if (flash) {
          const a = Math.pow(glow, 1.6) * end;
          flash.style.opacity = String(a);
          // The card's own height isn't known ahead of time, so anchor its
          // bottom edge 16px above the node's top (where the dot sits) using
          // -100% of its own box, then layer the rise/scale on top of that.
          const rise = (1 - a) * 10;
          flash.style.transform = `translate(-50%, calc(-100% - 16px + ${rise.toFixed(1)}px)) scale(${(0.86 + a * 0.14).toFixed(3)})`;
        }
      });

      // Human-review checkpoint: same reactive glow as a stage node, but its own
      // smaller marker sitting directly on the curve between Verify and Deploy.
      {
        let glow = 0;
        TOKEN_DELAYS.forEach((delay) => {
          const p = (((time - delay * LOOP) % LOOP) + LOOP) % LOOP / LOOP;
          const g = clamp(1 - dist(p, CHECKPOINT_P) / EPS, 0, 1);
          if (g > glow) glow = g;
        });
        checkpointRing.style.opacity = String(0.16 + glow * 0.84);
        checkpointRing.style.transform = `translate(-50%,-50%) scale(${1 + glow * 0.6})`;
        checkpointDot.style.transform = `translate(-50%,-50%) scale(${1 + glow * 0.18})`;
        checkpointDot.style.boxShadow = glow > 0.4 ? `0 0 0 ${(glow * 3).toFixed(1)}px rgba(184,134,11,.14)` : 'none';

        const nowAbove = glow > 0.75;
        if (nowAbove && !checkpointState.above && time - checkpointState.lastTrigger > MIN_GAP) {
          checkpointState.trigger = time;
          checkpointState.lastTrigger = time;
        }
        checkpointState.above = nowAbove;
        const a = captionEnv(time - checkpointState.trigger);
        checkpointCaption.style.opacity = String(a);
        checkpointCaption.style.transform = `translate(-50%,${(1 - a) * 4}px)`;
      }

      // Tokens: ride the curve, fade at the lap seam, dip into each node on arrival
      // (so they read as "handed off" rather than doubling up on the node's own
      // icon), and swap icon the moment they cross a stage.
      TOKEN_DELAYS.forEach((delay, i) => {
        const p = (((time - delay * LOOP) % LOOP) + LOOP) % LOOP / LOOP;
        const x = tokenX(p);
        const bob = Math.sin(time * 1.8 + i * 2.1) * 1.2;
        const yOffset = waveVal(p) * AMP_PX + bob;
        const el = tokens[i];
        el.style.left = `${x * 100}%`;
        el.style.top = `calc(var(--line-y) + ${yOffset.toFixed(2)}px)`;

        const nearestNode = Math.min(...NODE_P.map((nf) => dist(p, nf)), dist(p, CHECKPOINT_P));
        const dip = smoothstep(0, 0.05, nearestNode); // 0 right at a node, 1 mid-flight
        el.style.opacity = String(edgeFade(p) * (0.12 + dip * 0.88) * end);
        el.style.transform = `scale(${0.62 + dip * 0.4})`;

        const zone = clamp(Math.round(p * 5), 0, 5);
        tokenIcons[i].forEach((icon, z) => {
          icon.style.opacity = z === zone ? '1' : '0';
        });
      });
    };

    let running = false;
    const tick = (now: number) => {
      t += Math.min(0.05, (now - last) / 1000) * SPEED;
      last = now;
      draw(t);
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (raf || reduced || running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };

    draw(reduced ? REST : 0);

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()), { threshold: 0.2 });
    io.observe(root);

    return () => {
      pause();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="eflow"
      role="img"
      aria-label={
        label ||
        'A continuous engineering workflow moving from intent to specification, build, test and verify, with AI embedded at every stage, a human review checkpoint before deploy, and small artifacts flowing through each step'
      }
    >
      <svg className="eflow-svg" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="eflow-path" d={LINE_D} pathLength={1000} />
        <path className="eflow-sweep" d={LINE_D} pathLength={1000} />
      </svg>

      {Array.from({ length: TOKEN_DELAYS.length }, (_, i) => (
        <span key={i} data-ef="token" className="eflow-token" aria-hidden="true">
          {STAGES.map((s, z) => (
            <svg
              key={s.key}
              data-icon
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: z === 0 ? 1 : 0 }}
            >
              {STAGE_ICON[s.key]}
            </svg>
          ))}
        </span>
      ))}

      <div className="eflow-nodes" aria-hidden="true">
        {STAGES.map((s) => (
          <div className={`eflow-node tone-${s.tone}`} key={s.key}>
            <div data-ef="flashcard" className="eflow-flashcard">
              <div className="eflow-flashcard-body">{STAGE_CARD[s.key]}</div>
              {s.caption && <div className="eflow-flashcard-cap">{s.caption}</div>}
            </div>
            {s.badge && (
              <span data-ef="badge" className={`eflow-badge eflow-badge-${s.badge}`} title={s.badge === 'ai' ? 'AI-assisted' : 'Human-reviewed'}>
                {s.badge === 'ai' ? <AiMark /> : <HumanMark />}
              </span>
            )}
            <span data-ef="ring" className="eflow-ring" />
            <span className="eflow-dot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                {STAGE_ICON[s.key]}
              </svg>
            </span>
            <span className="eflow-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div
        className="eflow-checkpoint"
        style={{ left: `${CHECKPOINT_LEFT}%`, top: `calc(var(--line-y) + ${CHECKPOINT_TOP_OFFSET.toFixed(2)}px)` }}
        aria-hidden="true"
        title="Human review — a person signs off before anything ships"
      >
        <span data-ef="cpcaption" className="eflow-caption eflow-caption-cp">
          Approved to ship
        </span>
        <span data-ef="cpring" className="eflow-ring eflow-ring-cp" />
        <span data-ef="cpdot" className="eflow-checkpoint-dot">
          <HumanMark />
        </span>
        <span className="eflow-checkpoint-label">Human review</span>
      </div>
    </div>
  );
}
