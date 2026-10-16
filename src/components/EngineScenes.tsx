'use client';

import type { ReactNode } from 'react';
import { AiMark } from './EngineeringFlow';

/*
 * What plays inside each stage window — one plain-language story: a live shipment dashboard for a
 * logistics portal. Each scene is a pure function of `c`, the seconds since the window landed, and is
 * built to read for a non-technical viewer: a chat, a project plan, the dashboard itself taking shape,
 * a quality check that catches and fixes a problem, a launch checklist, and a live performance view.
 */
export const TITLES = ['Chat with P10', 'Project plan', 'Shipment Tracker — preview', 'Quality check', 'Launch', 'Live performance'];
export const STATUS = ['Understanding your request', 'Writing the plan', 'Building the dashboard', 'Checking quality', 'Launching to your team', 'Watching performance'];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, s: number, d: number) => clamp((t - s) / d);
const ease = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };
const typed = (text: string, c: number, start: number, dur: number) => text.slice(0, Math.floor(prog(c, start, dur) * text.length));
const typing = (text: string, c: number, start: number, dur: number) => c >= start && c < start + dur && typed(text, c, start, dur).length < text.length;
const count = (v: number, c: number, at: number, d: number) => Math.round(v * ease(prog(c, at, d))).toLocaleString('en-US');
const rise = (c: number, at: number, d = 0.45) => { const o = ease(prog(c, at, d)); return { opacity: o, transform: `translateY(${(1 - o) * 8}px)` }; };

function Tick({ on, tone }: { on: boolean; tone?: 'fail' }) {
  return tone === 'fail'
    ? <span className="er-check fail" aria-hidden><svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" /></svg></span>
    : <span className={`er-check${on ? ' on' : ''}`} aria-hidden><svg viewBox="0 0 12 12"><path d="M2.4 6.3l2.4 2.4 4.8-5.2" /></svg></span>;
}
const Caret = () => <i className="ew-caret" />;
const Spark = () => <span className="ew-spark"><AiMark /></span>;
const Dots = () => <span className="ew-dots"><i /><i /><i /></span>;

function Bubble({ who, c, at, children }: { who: 'you' | 'ai'; c: number; at: number; children: ReactNode }) {
  const o = ease(prog(c, at, 0.35));
  return (
    <div className={`ew-msg ${who}`} style={{ opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
      <span className="ew-av">{who === 'ai' ? <AiMark /> : 'You'}</span>
      <div className="ew-bubble">{children}</div>
    </div>
  );
}

// ---- the shipment map, shared by Build, QA and Launch ----------------------------------------------
type Q = [[number, number], [number, number], [number, number]];
const ROUTES: Q[] = [[[48, 78], [130, 14], [222, 60]], [[96, 132], [200, 172], [320, 134]], [[222, 60], [300, 28], [388, 70]], [[150, 56], [230, 122], [334, 140]]];
const DOTS: [number, number, boolean][] = [[0, 0.15, false], [0, 0.6, false], [1, 0.3, false], [2, 0.1, true], [2, 0.55, false], [3, 0.4, false], [3, 0.85, false]];
const along = ([a, b, e]: Q, u: number): [number, number] => [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * b[0] + u * u * e[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * b[1] + u * u * e[1]];

function ShipMap({ c, empty }: { c: number; empty?: boolean }) {
  return (
    <svg className="ew-mapsvg" viewBox="0 0 420 190">
      <ellipse cx="108" cy="72" rx="92" ry="46" fill="#eef2f4" /><ellipse cx="292" cy="62" rx="104" ry="40" fill="#eef2f4" />
      <ellipse cx="332" cy="142" rx="50" ry="22" fill="#eef2f4" /><ellipse cx="66" cy="142" rx="38" ry="18" fill="#eef2f4" />
      {empty ? <text x="210" y="100" textAnchor="middle" className="ew-empty">No shipments found</text> : (
        <>
          {ROUTES.map(([a, b, e], r) => <path key={r} d={`M${a} Q${b} ${e}`} fill="none" stroke="#c4d0d6" strokeWidth="1.6" strokeDasharray="1 5" strokeLinecap="round" />)}
          {ROUTES.map(([a, , e], r) => <g key={r}><circle cx={a[0]} cy={a[1]} r="3" fill="#b9c6cd" /><circle cx={e[0]} cy={e[1]} r="3" fill="#b9c6cd" /></g>)}
          {DOTS.map(([r, off, late], k) => {
            const [x, y] = along(ROUTES[r], (c * 0.09 + off) % 1);
            return <g key={k}>{late && <circle cx={x} cy={y} r="9" fill="#e5484d" opacity=".2" />}<circle cx={x} cy={y} r="4" fill={late ? '#e5484d' : '#3a4a5a'} /></g>;
          })}
        </>
      )}
    </svg>
  );
}
const DELAYS: [string, string, string][] = [['Rotterdam → Berlin', 'Customs hold', '+2h 10m'], ['Singapore → Perth', 'Port congestion', '+45m'], ['Hamburg → Oslo', 'Weather', '+30m']];

// ---- 1. Intent: a plain conversation ------------------------------------------------------------------
function Chat({ c }: { c: number }) {
  const u1 = 'I need a dashboard where our team can see every shipment live and spot delays.';
  const a1 = 'Happy to help. Should it show a map, a list of delays, or both?';
  const u2 = 'Both, and let us filter by region.';
  const a2 = "Got it. I'll turn that into a plan.";
  return (
    <div className="ew-chat">
      <Bubble who="you" c={c} at={0.05}>{typed(u1, c, 0.1, 1.6)}{typing(u1, c, 0.1, 1.6) && <Caret />}</Bubble>
      <Bubble who="ai" c={c} at={2.0}>{c < 2.8 ? <Dots /> : <>{typed(a1, c, 2.8, 1.3)}{typing(a1, c, 2.8, 1.3) && <Caret />}</>}</Bubble>
      <Bubble who="you" c={c} at={4.6}>{typed(u2, c, 4.7, 0.9)}{typing(u2, c, 4.7, 0.9) && <Caret />}</Bubble>
      <Bubble who="ai" c={c} at={6.2}>{c < 6.7 ? <Dots /> : <>{typed(a2, c, 6.7, 0.9)}{typing(a2, c, 6.7, 0.9) && <Caret />}</>}</Bubble>
    </div>
  );
}

// ---- 2. Specification: a friendly project plan ---------------------------------------------------------
function Plan({ c }: { c: number }) {
  const goal = 'Help the ops team see every shipment live and act on delays quickly.';
  const items = ['Show all shipments on a live map', 'Flag delays with new arrival times', 'Filter by region or carrier', 'Give each team the right access'];
  return (
    <div className="ew-doc">
      <aside className="ew-outline">
        {['Overview', 'What it will do'].map((x, i) => <span key={x} className={(c < 1.4 ? 0 : 1) === i ? 'on' : ''}>{x}</span>)}
      </aside>
      <article>
        <h4 style={{ opacity: ease(prog(c, 0, 0.4)) }}>Shipment dashboard</h4>
        <small>Goal</small>
        <p>{typed(goal, c, 0.35, 1.0)}{typing(goal, c, 0.35, 1.0) && <Caret />}</p>
        <small style={{ opacity: ease(prog(c, 1.4, 0.3)) }}>What it will do</small>
        <ul>
          {items.map((r, i) => {
            const st = 1.55 + i * 0.6;
            return (
              <li key={r} style={{ opacity: ease(prog(c, st, 0.2)) }}>
                <Tick on={c >= st + 0.55} /><span>{typed(r, c, st, 0.5)}{typing(r, c, st, 0.5) && <Caret />}</span>
              </li>
            );
          })}
        </ul>
        <span className={`ew-badge${c >= 4.2 ? ' on' : ''}`}><AiMark />Plan ready</span>
      </article>
    </div>
  );
}

// ---- 3. Build: the dashboard itself, assembling live ---------------------------------------------------
type Tok = [string, 'k' | 'f' | 'a' | 'p'];
const CODE: Tok[][] = [
  [['function ', 'k'], ['ShipmentTracker', 'f'], ['() {', 'p']],
  [['  const ', 'k'], ['shipments = ', 'p'], ['useLiveShipments', 'f'], ['();', 'p']],
  [['  return ', 'k'], ['(', 'p']],
  [['    <', 'p'], ['Dashboard', 'f'], [' data', 'a'], ['={shipments}>', 'p']],
  [['      <', 'p'], ['KpiTiles', 'f'], [' />', 'p']],
  [['      <', 'p'], ['ShipmentMap', 'f'], [' />', 'p']],
  [['      <', 'p'], ['DelayAlerts', 'f'], [' />', 'p']],
  [['      <', 'p'], ['RegionFilter', 'f'], [' />', 'p']],
  [['    </', 'p'], ['Dashboard', 'f'], ['>', 'p']],
  [['  );', 'p']],
  [['}', 'p']],
];
const lineLen = (l: Tok[]) => l.reduce((n, [t]) => n + t.length, 0);
const CODE_TOTAL = CODE.reduce((n, l) => n + lineLen(l) + 1, 0);
const CODE_END = CODE.map((_, i) => CODE.slice(0, i + 1).reduce((n, l) => n + lineLen(l) + 1, 0)); // chars typed once line i is complete

// The editor stays on screen beside the result: each dashboard piece appears the moment the line that
// creates it is finished.
function Dashboard({ c }: { c: number }) {
  const typedAll = Math.floor(prog(c, 0.3, 3.6) * CODE_TOTAL);
  let budget = typedAll;
  const kpis = typedAll >= CODE_END[4], map = typedAll >= CODE_END[5], alerts = typedAll >= CODE_END[6], filterOn = typedAll >= CODE_END[7];
  const saved = typedAll >= CODE_TOTAL;
  return (
    <div className="ew-split">
      <div className="ew-codep">
        <div className="ew-codehead"><span className="ew-file">ShipmentTracker.tsx</span><span className={`ew-saved${saved ? ' on' : ''}`}>{saved ? '✓ Saved' : <><Spark />AI writing…</>}</span></div>
        <pre className="ew-codebody">
          {CODE.map((line, li) => {
            const len = lineLen(line);
            const n = clamp(budget, 0, len);
            const cur = typedAll > 0 && !saved && budget > 0 && budget <= len + 1;
            budget -= len + 1;
            let left = n;
            return (
              <div key={li} className={`ew-cl${cur ? ' cur' : ''}`}>
                <span className="ew-cn">{li + 1}</span>
                {line.map(([t, kind], ti) => { const part = t.slice(0, Math.max(0, left)); left -= t.length; return <span key={ti} className={`ew-t-${kind}`}>{part}</span>; })}
                {cur && <Caret />}
              </div>
            );
          })}
        </pre>
      </div>
      <div className="ew-app">
        <div className="ew-app-head" style={rise(c, 0.1)}>
          <b>Shipment Tracker</b>
          <span className="ew-chips"><i className={filterOn ? 'on' : ''}>Region ▾</i><i className={filterOn ? 'on' : ''}>Carrier ▾</i></span>
          <span className="ew-live"><span className="er-live-dot" />Live</span>
        </div>
        <div className={`ew-pop ew-kpi4${kpis ? ' on' : ''}`}>
          {[['In transit', count(1284, c, 1.5, 0.8)], ['Delayed', count(37, c, 1.5, 0.8)], ['On time', `${count(96, c, 1.5, 0.8)}%`], ['Avg. delivery', `${(2.4 * ease(prog(c, 1.5, 0.8))).toFixed(1)} d`]].map(([k, v], i) => (
            <div key={k} className={i === 1 ? 'warn' : ''}><small>{k}</small><b>{v}</b></div>
          ))}
        </div>
        <div className="ew-grid">
          <div className={`ew-pop ew-card${map ? ' on' : ''}`}><div className="ew-card-t">Live map</div><ShipMap c={c} /></div>
          <div className={`ew-pop ew-card${alerts ? ' on' : ''}`}><div className="ew-card-t">Delays <em>{DELAYS.length}</em></div>
            {DELAYS.map(([route, why, late]) => (
              <div key={route} className="ew-delay"><div><b>{route}</b><small>{why}</small></div><span>{late}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- 4. QA: plain checks, one real problem, fixed in front of you ---------------------------------------
function Quality({ c }: { c: number }) {
  const fixed = c >= 4.9, rechecking = c >= 4.3 && !fixed;
  const checks: [string, number, boolean][] = [['Map shows every shipment', 0.5, true], ['Delays are flagged in red', 0.9, true], ['“All regions” shows results', 1.3, false], ['Alerts update when a delay changes', 1.7, true]];
  const note = 'Found a problem: choosing “All regions” shows nothing. Fixing it now.';
  const passed = count(126, c, 5.3, 0.9);
  return (
    <div className="ew-qa">
      <div className="ew-qa-l">
        <div className="ew-label2">Quality checks</div>
        {checks.map(([name, at, ok]) => {
          const shown = c >= at, pass = ok || fixed;
          return (
            <div key={name} className={`ew-check-row${shown ? ' on' : ''}${shown && !pass && !rechecking ? ' fail' : ''}`}>
              {rechecking && !ok ? <i className="ew-spin" /> : pass ? <Tick on={shown} /> : <Tick on={false} tone="fail" />}
              <span>{name}</span>
            </div>
          );
        })}
        <div className="ew-note" style={rise(c, 2.4)}>
          <Spark /><p>{typed(note, c, 2.5, 1.5)}{typing(note, c, 2.5, 1.5) && <Caret />}{fixed && <b>  ✓ Fixed and re-checked</b>}</p>
        </div>
      </div>
      <div className="ew-qa-r">
        <div className="ew-card ew-prevcard">
          <div className="ew-card-t">Preview <span className="ew-pillsm">Region: All regions</span></div>
          <div className="ew-fade" style={{ opacity: 1 - ease(prog(c, 4.5, 0.4)) }}><ShipMap c={c} empty /></div>
          <div className="ew-fade over" style={{ opacity: ease(prog(c, 4.7, 0.5)) }}><ShipMap c={c} /></div>
        </div>
        <div className="ew-sum2" style={rise(c, 5.3)}>
          <div><b>{passed}</b> of 126 checks passed</div>
          <div className="er-bar"><i className="ok" style={{ transform: `scaleX(${ease(prog(c, 5.3, 0.9))})` }} /></div>
          <div className="ew-sum2-row" style={{ opacity: ease(prog(c, 6.5, 0.4)) }}><span>Matches the plan · 100%</span><span className={`ew-pill${c >= 7.4 ? ' ok' : ''}`}>{c >= 7.4 ? '✓ Approved' : 'In review'}</span></div>
        </div>
      </div>
    </div>
  );
}

// ---- 5. Deploy: a launch checklist -----------------------------------------------------------------------
function Launch({ c }: { c: number }) {
  const steps: [string, string, number, number][] = [['Preparing the new version', 'Packaging everything up', 0.2, 1.0], ['Testing with a small group', 'Checking it works for real users', 1.1, 2.2], ['Rolling out to everyone', '', 2.3, 3.9]];
  const pct = Math.round(ease(prog(c, 2.3, 1.6)) * 100);
  const live = c >= 4.0;
  return (
    <div className="ew-launch">
      <div className="ew-steps">
        {steps.map(([t, sub, a, b], i) => {
          const p = prog(c, a, b - a), done = p >= 1, run = p > 0 && p < 1;
          return (
            <div key={t} className={`ew-lstep${done ? ' done' : ''}${run ? ' run' : ''}`} style={{ opacity: c >= a ? 1 : 0.4 }}>
              <span className="ew-node2">{done ? <Tick on /> : run ? <i className="ew-spin" /> : <i className="ew-pend" />}</span>
              <div><b>{t}</b><small>{i === 2 ? (c >= a ? `${pct}% of your team` : 'Gradually, to stay safe') : sub}</small></div>
            </div>
          );
        })}
        <div className={`ew-golive${live ? ' on' : ''}`}><span className="er-live-dot" />Live<em>Your team is using it now</em></div>
      </div>
      <div className="ew-card ew-launchcard" style={{ opacity: 0.45 + 0.55 * ease(prog(c, 3.8, 0.5)) }}>
        <div className="ew-card-t">Shipment Tracker <span className={`ew-livetag${live ? ' on' : ''}`}>LIVE</span></div>
        <div className="ew-kpi4 small"><div><small>In transit</small><b>1,284</b></div><div className="warn"><small>Delayed</small><b>37</b></div><div><small>On time</small><b>96%</b></div></div>
        <ShipMap c={c} />
      </div>
    </div>
  );
}

// ---- 6. Observe: watching it work, learning, improving ------------------------------------------------------
const curve = (x: number) => (x < 0.62 ? 0.85 - 0.04 * Math.sin(x * 40) : x < 0.78 ? 0.85 - 0.75 * ease((x - 0.62) / 0.16) : 0.1);
function Perf({ c }: { c: number }) {
  const p = prog(c, 0.8, 5.0);
  const pts = Array.from({ length: Math.max(2, Math.round(p * 60) + 1) }, (_, k) => { const x = (k / 60); return [x * 296 + 2, 142 - curve(Math.min(x, p)) * 128] as [number, number]; });
  const last = pts[pts.length - 1];
  const delay = c < 2.2 ? ['Checking…', ''] : c < 4.7 ? ['2 min', 'bad'] : ['10 sec', 'good'];
  const cards: [string, string, string, number][] = [['Spotted', 'warn', 'Alerts for Asia-Pacific arrive about 2 minutes late.', 2.2], ['Fixed', 'blue', 'Data now refreshes every 10 seconds, not 30.', 4.1], ['Result', 'good', 'Alerts now arrive in under 10 seconds.', 5.6]];
  return (
    <div className="ew-perf">
      <div className="ew-kpi3" style={rise(c, 0.1)}>
        <div><small>Shipments tracked live</small><b>{count(1284, c, 0.2, 0.8)}</b></div>
        <div><small>Errors</small><b className="good">0%</b></div>
        <div><small>Alert delay</small><b className={delay[1]}>{delay[0]}</b></div>
      </div>
      <div className="ew-perf-grid">
        <div className="ew-card" style={rise(c, 0.4)}>
          <div className="ew-card-t">How fast alerts arrive</div>
          <svg viewBox="0 0 300 150" className="ew-chart">
            <path d="M2 142H298M2 78H298M2 14H298" stroke="#eef2f4" strokeWidth="1" />
            <path d={'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')} fill="none" stroke={c >= 4.4 ? '#1a9b6c' : '#e0912b'} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={last[0]} cy={last[1]} r="4.5" fill="#fff" stroke={c >= 4.4 ? '#1a9b6c' : '#e0912b'} strokeWidth="2.2" />
          </svg>
          <div className="ew-axis"><span>Earlier</span><span>Now</span></div>
        </div>
        <div className="ew-insights">
          {cards.map(([tag, tone, text, at]) => (
            <div key={tag} className="ew-insight" style={rise(c, at)}><span className={`ew-tag ${tone}`}>{tag}</span><p>{typed(text, c, at + 0.1, 0.9)}{typing(text, c, at + 0.1, 0.9) && <Caret />}</p></div>
          ))}
          <div className="ew-learn" style={rise(c, 7.0)}><Spark />Added to the plan for the next release</div>
        </div>
      </div>
    </div>
  );
}

export function Scene({ k, c }: { k: string; c: number }): ReactNode {
  switch (k) {
    case 'intent': return <Chat c={c} />;
    case 'spec': return <Plan c={c} />;
    case 'build': return <Dashboard c={c} />;
    case 'qa': return <Quality c={c} />;
    case 'deploy': return <Launch c={c} />;
    default: return <Perf c={c} />;
  }
}
