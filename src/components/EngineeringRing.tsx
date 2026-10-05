'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AiMark, STAGE_ICON } from './EngineeringFlow';
import Platform, { PCX, PCY, PH, PW, calloutGeom, iconPos } from './EnginePlatform';

/*
 * The P10 delivery platform, one stage at a time — each stage opens as a working window.
 *
 * A raised cream-and-gold platform (see EnginePlatform) assembles around the P10 core. For each of the
 * six stages the matching segment lifts and glows, a signal runs from the core to it, its callout fades
 * in beside the platform, and a wide window grows out of the segment while the platform dims behind it.
 * A short AI-driven scene plays inside (chat → PRD → editor → QA with a self-fix and review → release →
 * observe), then the window shrinks back into its segment. After Observe the whole platform glows
 * softly, holds, and everything loops.
 * Interactive: it plays on its own; clicking it pauses (the icon in the corner resumes). Paused, a
 * segment opens that stage's window, which plays once and stays open until its ✕ closes it. Under
 * reduced motion an opened stage is shown fully played and static.
 * One story runs throughout: "Password reset". The scene is a pure function of a looping clock `t`;
 * only opacity/transform/stroke offsets animate. Reduced motion shows the finished platform.
 */
const W = PW, H = PH;
const ICONS: Record<string, ReactNode> = {
  intent: (<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.2 1.1 2.2h5c0-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3Z" /></>),
  spec: STAGE_ICON.spec,
  build: STAGE_ICON.build,
  qa: STAGE_ICON.verify,
  deploy: STAGE_ICON.deploy,
  observe: (<><rect x="4" y="12" width="4" height="8" rx="1" /><rect x="10" y="4" width="4" height="16" rx="1" /><rect x="16" y="9" width="4" height="11" rx="1" /></>),
};
const STAGES = [
  { key: 'intent', label: 'Intent', hint: 'You describe the feature', head: "Define the 'why'", body: 'Turn business goals into clear, actionable outcomes with AI.' },
  { key: 'spec', label: 'Specification', hint: 'AI drafts the spec', head: 'Turn intent into design', body: 'AI-assisted requirements, architecture and planning.' },
  { key: 'build', label: 'Build', hint: 'AI writes the code', head: 'Build faster', body: 'AI-native development, with intelligent copilots and reusable components.' },
  { key: 'qa', label: 'QA', hint: 'AI tests and fixes itself', head: 'Assure at speed', body: 'AI-powered testing, security and quality checks.' },
  { key: 'deploy', label: 'Deploy', hint: 'AI ships to production', head: 'Release with confidence', body: 'Automated deployments and AI-assisted change management.' },
  { key: 'observe', label: 'Observe', hint: 'AI watches and learns', head: 'Learn and improve', body: 'Real-time insights, anomaly detection and continuous optimisation.' },
];
const N = STAGES.length; // = SEGS
const DUR = [9.6, 7.0, 7.0, 10.4, 8.0, 9.0]; // seconds per stage — QA runs longest (tests, the AI self-fix, then review)
const START = DUR.map((_, i) => DUR.slice(0, i).reduce((a, b) => a + b, 0));
const T_FINAL = DUR.reduce((a, b) => a + b, 0); // finished platform holds from here
const LOOP = T_FINAL + 3.6;
const REDUCED_T = T_FINAL + 1.5;
const C0 = 1.45; // step-local time at which the window has landed and its scene begins
type Mode = 'auto' | 'paused' | 'manual';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, s: number, d: number) => clamp((t - s) / d);
const ease = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };
const typed = (text: string, c: number, start: number, dur: number) => text.slice(0, Math.floor(prog(c, start, dur) * text.length));
const typing = (text: string, c: number, start: number, dur: number) => c >= start && c < start + dur && typed(text, c, start, dur).length < text.length;

const TITLES = ['p10 — session', 'password-reset.prd.md', 'reset.ts — src/auth', 'p10 — qa', 'p10 — release', 'p10 — observe'];
const STATUS = ['Understanding your request', 'Writing the spec', 'Generating code', 'Testing and reviewing against the spec', 'Deploying to production', 'Monitoring production'];

type Tok = [string, 'k' | 'f' | 's' | 'p'];
const CODE: Tok[][] = [
  [['export async function ', 'k'], ['requestReset', 'f'], ['(email: string) {', 'p']],
  [['  const ', 'k'], ['token = ', 'p'], ['createToken', 'f'], ['(email, ', 'p'], ["'15m'", 's'], [');', 'p']],
  [['  await ', 'k'], ['sendEmail', 'f'], ['(email, ', 'p'], ['resetLink', 'f'], ['(token));', 'p']],
  [['}', 'p']],
  [],
  [['export async function ', 'k'], ['resetPassword', 'f'], ['(token: string, pw: string) {', 'p']],
  [['  const ', 'k'], ['user = ', 'p'], ['await ', 'k'], ['verifyToken', 'f'], ['(token);', 'p']],
  [['  await ', 'k'], ['setPassword', 'f'], ['(user.id, ', 'p'], ['hash', 'f'], ['(pw));', 'p']],
  [['}', 'p']],
];
const lineLen = (l: Tok[]) => l.reduce((n, [s]) => n + s.length, 0);
const CODE_TOTAL = CODE.reduce((n, l) => n + lineLen(l) + 1, 0);

function Tick({ on }: { on: boolean }) {
  return (
    <span className={`er-check${on ? ' on' : ''}`} aria-hidden>
      <svg viewBox="0 0 12 12"><path d="M2.4 6.3l2.4 2.4 4.8-5.2" /></svg>
    </span>
  );
}
const Caret = () => <i className="ew-caret" />;
const Spark = () => <span className="ew-spark"><AiMark /></span>;

// A live agent session, Claude-Code style: the user prompt, streamed assistant text, tool calls with their
// output, diffs and a "thinking" line. Only events that have started are rendered and the list is
// bottom-anchored, so older lines scroll up and out exactly as a terminal does.
type Ev = { at: number; kind: 'user' | 'text' | 'tool' | 'out' | 'diff' | 'think'; text?: string; lines?: string[]; dur?: number; until?: number; tone?: 'ok' | 'fail' | 'dim' };
// typing pace wobbles a little (bursts and pauses) instead of running at a constant rate
const stream = (text: string, c: number, at: number, dur: number) => {
  const p = prog(c, at, dur);
  return text.slice(0, Math.floor(clamp(p + 0.025 * Math.sin(p * Math.PI * 9) * (1 - p)) * text.length));
};
function Transcript({ ev, c }: { ev: Ev[]; c: number }) {
  return (
    <div className="ew-term">
      {ev.map((e, i) => {
        if (c < e.at) return null;
        const dur = e.dur ?? 0.3;
        const live = c < e.at + dur;
        switch (e.kind) {
          case 'user':
            return <div key={i} className="t-user"><span>&gt;</span><span>{stream(e.text!, c, e.at, dur)}{live && <Caret />}</span></div>;
          case 'text':
            return <div key={i} className="t-text"><i>●</i><span>{stream(e.text!, c, e.at, dur)}{live && <Caret />}</span></div>;
          case 'tool': {
            const t = stream(e.text!, c, e.at, dur), k = t.indexOf('(');
            return <div key={i} className="t-tool"><i>●</i><span>{k < 0 ? <b>{t}</b> : <><b>{t.slice(0, k)}</b>{t.slice(k)}</>}</span></div>;
          }
          case 'out':
            return <div key={i} className={`t-out ${e.tone ?? ''}`}><span>⎿</span><span>{e.text}</span></div>;
          case 'diff':
            return <div key={i} className="t-diff">{e.lines!.map((l, li) => <div key={li} className={l[0] === '+' ? 'add' : l[0] === '-' ? 'del' : ''}>{l}</div>)}</div>;
          default:
            return c < e.until! ? <div key={i} className="t-think"><span>✻</span>Thinking… ({Math.floor(c - e.at + 1)}s)</div> : null;
        }
      })}
    </div>
  );
}

const INTENT: Ev[] = [
  { at: 0.1, kind: 'user', text: 'Let users reset their password by email.', dur: 1.2 },
  { at: 1.5, kind: 'think', until: 2.3 },
  { at: 2.3, kind: 'tool', text: 'Search("auth")' }, { at: 2.7, kind: 'out', text: 'Found 12 files', tone: 'dim' },
  { at: 3.1, kind: 'tool', text: 'Read(src/auth/session.ts)' }, { at: 3.5, kind: 'out', text: 'Read 84 lines', tone: 'dim' },
  { at: 4.0, kind: 'text', text: 'Should reset links expire?', dur: 0.8 },
  { at: 5.1, kind: 'user', text: 'Yes, after 15 minutes.', dur: 0.8 },
  { at: 6.2, kind: 'text', text: 'Got it. Drafting the spec…', dur: 0.8 },
];
const QA: Ev[] = [
  { at: 0.1, kind: 'tool', text: 'Bash(npm test)' },
  { at: 0.55, kind: 'out', text: '✓ sends a reset email', tone: 'ok' }, { at: 0.9, kind: 'out', text: '✓ link expires after 15 minutes', tone: 'ok' },
  { at: 1.25, kind: 'out', text: '✕ link can be used only once', tone: 'fail' }, { at: 1.6, kind: 'out', text: '✓ rejects weak passwords', tone: 'ok' },
  { at: 2.0, kind: 'out', text: 'Tests: 1 failed, 3 passed', tone: 'fail' },
  { at: 2.6, kind: 'text', text: 'The single-use test fails: verifyToken() never invalidates the token. Fixing it.', dur: 1.6 },
  { at: 4.4, kind: 'tool', text: 'Update(src/auth/reset.ts)' },
  { at: 4.8, kind: 'diff', lines: ['  const user = decode(token);', '+ await invalidate(token);'] },
  { at: 5.4, kind: 'tool', text: 'Bash(npm test)' }, { at: 5.9, kind: 'out', text: 'Tests: 48 passed, 48 total', tone: 'ok' },
  { at: 6.5, kind: 'text', text: 'All requirements covered. Spec coverage 100%.', dur: 1.0 },
  { at: 7.7, kind: 'out', text: '✓ Review approved', tone: 'ok' },
];
const DEPLOY: Ev[] = [
  { at: 0.1, kind: 'tool', text: 'Bash(git push origin main)' }, { at: 0.5, kind: 'out', text: 'Pipeline #2041 started', tone: 'dim' },
  { at: 1.0, kind: 'out', text: '✓ Build image · 14s', tone: 'ok' }, { at: 1.5, kind: 'out', text: '✓ Staging deployed · smoke checks passed', tone: 'ok' },
  { at: 2.1, kind: 'tool', text: 'Bash(p10 deploy --prod)' },
  { at: 2.5, kind: 'out', text: '✓ 10% of traffic', tone: 'ok' }, { at: 3.0, kind: 'out', text: '✓ 50% of traffic', tone: 'ok' }, { at: 3.5, kind: 'out', text: '✓ 100% of traffic', tone: 'ok' },
  { at: 4.1, kind: 'text', text: 'v2.14.0 is live. Error rate 0%, p95 118 ms.', dur: 1.1 },
];

const OBSERVE: Ev[] = [
  { at: 0.1, kind: 'tool', text: 'Bash(p10 observe --live)' }, { at: 0.55, kind: 'out', text: 'Streaming metrics from production', tone: 'dim' },
  { at: 1.1, kind: 'out', text: '✓ Error rate 0.0%', tone: 'ok' }, { at: 1.5, kind: 'out', text: '✓ p95 latency 118 ms', tone: 'ok' },
  { at: 1.9, kind: 'out', text: '✓ 1,204 resets completed today', tone: 'ok' },
  { at: 2.6, kind: 'text', text: 'No anomalies, but token lookups are slow. Adding an index.', dur: 1.4 },
  { at: 4.3, kind: 'tool', text: 'Update(db/indexes.ts)' }, { at: 4.7, kind: 'out', text: 'Added index tokens(user_id)', tone: 'dim' },
  { at: 5.3, kind: 'text', text: 'Latency down to 74 ms. Feeding this back into the next spec.', dur: 1.5 },
];

// Tool-call strip under the title bar for the windows whose body is a document, editor or release.
function Strip({ k, c }: { k: string; c: number }): ReactNode {
  const o = { opacity: ease(prog(c, 0.05, 0.3)) };
  if (k === 'spec') return <div className="ew-strip" style={o}><i>●</i><span><b>Write</b>(password-reset.prd.md)</span>{c >= 3.5 && <em>⎿ Wrote 12 lines</em>}</div>;
  if (k === 'build') return c < 3.9
    ? <div className="ew-strip" style={o}><i>●</i><span><b>Write</b>(src/auth/reset.ts)</span></div>
    : <div className="ew-strip"><i>●</i><span><b>Bash</b>(tsc --noEmit)</span>{c >= 4.4 && <em className="ok">⎿ ✓ No type errors</em>}</div>;
  if (k === 'deploy') {
    const live = c >= 5.1;
    return <div className="ew-strip" style={o}><span><b>Release</b> v2.14.0</span><span className={`ew-chip${live ? ' on' : ''}`}>{live ? <><span className="er-live-dot" />Live</> : <><i className="ew-spin" />Deploying</>}</span></div>;
  }
  return null;
}

// What plays inside the window for each stage. `c` is the scene-local time in seconds.
function Scene({ k, c }: { k: string; c: number }): ReactNode {
  switch (k) {
    case 'intent':
      return <Transcript ev={INTENT} c={c} />;
    case 'spec': {
      const goal = 'Users can securely regain access to their account by email.';
      const reqs = ['Email the user a reset link', 'Link expires after 15 minutes', 'Link can be used only once'];
      const sec = c < 1.3 ? 0 : 1;
      return (
        <div className="ew-doc">
          <aside className="ew-outline">
            {['Overview', 'Requirements'].map((x, i) => <span key={x} className={sec === i ? 'on' : ''}>{x}</span>)}
          </aside>
          <article>
            <h4 style={{ opacity: ease(prog(c, 0, 0.4)) }}>Password reset</h4>
            <small>Goal</small>
            <p>{typed(goal, c, 0.35, 0.9)}{typing(goal, c, 0.35, 0.9) && <Caret />}</p>
            <small style={{ opacity: ease(prog(c, 1.3, 0.3)) }}>Requirements</small>
            <ul>
              {reqs.map((r, i) => {
                const st = 1.45 + i * 0.6;
                return (
                  <li key={r} style={{ opacity: ease(prog(c, st, 0.2)) }}>
                    <Tick on={c >= st + 0.55} /><span>{typed(r, c, st, 0.5)}{typing(r, c, st, 0.5) && <Caret />}</span>
                  </li>
                );
              })}
            </ul>
            <span className={`ew-badge${c >= 3.4 ? ' on' : ''}`}><AiMark />Spec v1 ready</span>
          </article>
        </div>
      );
    }
    case 'build': {
      let budget = Math.floor(prog(c, 0.3, 3.4) * CODE_TOTAL);
      return (
        <div className="ew-ide">
          <aside className="ew-tree">
            <span className="dim">▾ src</span><span className="dim in">▾ auth</span>
            <span className="file on in2">reset.ts</span><span className="file in2">tokens.ts</span><span className="file in2">email.ts</span>
          </aside>
          <div className="ew-editor">
            <div className="ew-tabs"><span className="on">reset.ts</span><span>tokens.ts</span></div>
            <pre className="ew-code">
              {CODE.map((line, li) => {
                const len = lineLen(line);
                const n = clamp(budget, 0, len);
                const caret = n > 0 && n < len;
                budget -= len + 1;
                let left = n;
                return (
                  <div key={li} className="ew-line">
                    <span className="ew-ln">{li + 1}</span>
                    {line.map(([s, kind], si) => {
                      const part = s.slice(0, Math.max(0, left));
                      left -= s.length;
                      return <span key={si} className={`ew-${kind}`}>{part}</span>;
                    })}
                    {caret && <Caret />}
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      );
    }
    case 'qa':
      return <Transcript ev={QA} c={c} />;
    case 'deploy':
      return <Transcript ev={DEPLOY} c={c} />;
    default:
      return <Transcript ev={OBSERVE} c={c} />;
  }
}

export default function EngineeringRing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState<Mode>('auto');
  const eng = useRef({ mode: 'auto' as Mode, stage: 0, clock: 0, target: 0, reduced: false });
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
      if (e.mode === 'auto') e.clock = (e.clock + dt) % LOOP;
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
  const idx = finale ? N : START.filter((st) => t >= st).length - 1;
  const si = Math.min(idx, N - 1);
  const dur = DUR[si];
  const s = finale ? 0 : t - START[si];
  const c = s - C0;

  // Platform: segments assemble at the start of the loop, the active one lifts and glows, visited ones
  // keep a warm tint. The platform dims while a window is open. Window: born at the active segment,
  // grows to fill the stage, then shrinks back into it.
  const intro = mode === 'manual' ? 99 : t;
  const winIn = finale ? 0 : ease(prog(s, 0.8, 0.75));
  const winBack = finale ? 0 : ease(prog(s, dur - 1.0, 0.7));
  const winP = winIn * (1 - winBack); // 0 at the segment, 1 at the centre
  const winOp = Math.min(1, winIn * 4) * (1 - ease(prog(s, dur - 0.9, 0.55)));
  const platOp = finale ? 1 - ease(prog(t, LOOP - 0.8, 0.7)) : 1 - 0.82 * winP;
  const appear = STAGES.map((_, i) => ease(prog(intro, 0.1 + i * 0.1, 0.6)));
  const act = STAGES.map((_, i) => {
    if (finale) return 0;
    const up = ease(prog(t, START[i] + 0.05, 0.5)), down = ease(prog(t, START[i] + DUR[i] - 0.1, 0.5));
    return up * (mode === 'manual' && i === si ? 1 : 1 - down);
  });
  const tint = STAGES.map((_, i) => (finale ? 1 : ease(prog(t, START[i] + 0.4, 0.9))));
  const [ax, ay] = iconPos(si);
  const winX = ax + (PCX - ax) * winP, winY = ay + (PCY - 5 - ay) * winP;
  const stage = STAGES[si];
  const platLive = platOp > 0.3, winLive = winOp > 0.5;
  const sigP = finale ? 0 : prog(s, 0.1, 0.65);
  const callOp = finale ? 0 : ease(prog(s, 0.2, 0.5)) * (mode === 'manual' ? 1 : 1 - ease(prog(s, dur - 0.5, 0.4)));
  const cg = calloutGeom(si);

  return (
    <div className="er" ref={rootRef} style={{ height: H * scale }} role="group"
      aria-label="Six stages of AI-driven delivery — intent, specification, build, QA, deploy and observe — following one password-reset feature from request to production. Click to pause, then select a stage to open it.">
      <div className="er-stage" style={{ width: W, height: H, transform: `scale(${scale})` }}
        onClick={() => { if (eng.current.mode === 'auto') go('paused'); }}>
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
            <span className="ew-lights" aria-hidden><i /><i /><i /></span>
            <span className="ew-title" aria-hidden>{TITLES[si]}</span>
            <span className="ew-right">
              <span className="ew-ai" aria-hidden><AiMark /><b>AI</b></span>
              <button type="button" className="ew-close" aria-label={`Close ${stage.label}`} tabIndex={winLive ? 0 : -1}
                onClick={(ev) => { ev.stopPropagation(); close(); }}>
                <svg viewBox="0 0 12 12" aria-hidden><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" /></svg>
              </button>
            </span>
          </div>
          <div aria-hidden style={{ display: 'contents' }}>
            <Strip k={stage.key} c={c} />
            <div className="ew-body"><Scene k={stage.key} c={c} /></div>
          </div>
          <div className="ew-status" aria-hidden>
            <span className="ew-stage">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{ICONS[stage.key]}</svg>
              <b>{stage.label}</b><em>{si === N - 1 && c >= 5.1 ? "Live in production" : STATUS[si]}</em>
            </span>
            <span className="ew-pips">{STAGES.map((st, i) => <i key={st.key} className={i <= idx ? 'on' : ''} />)}</span>
          </div>
        </div>
      </div>

      <button type="button" className="er-toggle" aria-label={mode === 'auto' ? 'Pause animation' : 'Play animation'}
        onClick={(ev) => { ev.stopPropagation(); toggle(); }}>
        {mode === 'auto'
          ? <svg viewBox="0 0 12 12" aria-hidden><path d="M3.5 2v8M8.5 2v8" /></svg>
          : <svg viewBox="0 0 12 12" aria-hidden><path d="M3.5 2l6.5 4-6.5 4z" fill="currentColor" /></svg>}
      </button>
    </div>
  );
}
