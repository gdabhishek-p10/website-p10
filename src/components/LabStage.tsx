'use client';
import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import { useCycle } from '@/hooks/useLabs';
import { useInView } from '@/hooks/useInView';
import { STEPS } from './labApproachData';

const CYCLE_MS = 3000;
const LAST = STEPS.length - 1;

// The steps sit on the left half of a circle whose centre is the picture, so each one is the same distance from it. The circle is big enough to hold the picture
// and the words under it. The first and last dots stop short of the ends of the arc, which keeps the curve reading as a half globe. Sizes match --ls-r in styles.css.
const R = 280;
const DOTS = [-67.5, -22.5, 22.5, 67.5].map((a) => ({
  x: +(R * (1 - Math.cos((a * Math.PI) / 180))).toFixed(1),
  y: +(R + R * Math.sin((a * Math.PI) / 180)).toFixed(1),
  f: (a + 90) / 180, // how far along the arc, by length
}));
const ARC = `M${R} 0A${R} ${R} 0 0 0 ${R} ${2 * R}`;

// Stage v2: the same, with a straight vertical line instead of the arc (same stops along it, same fill).
const LINE_H = 420;
const LINE_DOTS = [0, 1, 2, 3].map((i) => ({ x: 0, y: LINE_H * (0.125 + 0.25 * i), f: 0.125 + 0.25 * i }));
const LINE = `M0 0V${LINE_H}`;

// Geometry of the one scene, in a 480 x 380 box with its origin at the middle. Every part is drawn once and moves between steps.
const BLOCKS = [
  { x: -98, y: -48, w: 196, h: 24 },
  { x: -98, y: -16, w: 84, h: 62 },
  { x: -4, y: -16, w: 102, h: 28 },
  { x: -4, y: 18, w: 102, h: 28 },
];
const BADGES = [
  { x: 82, y: -36, d: 0.45 },
  { x: -56, y: 15, d: 1.1 },
  { x: 82, y: -2, d: 0.86 },
  { x: 82, y: 32, d: 1.32 },
];
const ellipse = (rx: number, ry: number, deg: number) => ({
  x: +(rx * Math.cos((deg * Math.PI) / 180)).toFixed(1),
  y: +(ry * Math.sin((deg * Math.PI) / 180)).toFixed(1),
});
const RING1 = Array.from({ length: 6 }, (_, i) => ({ ...ellipse(104, 84, -90 + i * 60), s: 0.27, from: { x: 0, y: 0 } }));
const RING2 = Array.from({ length: 12 }, (_, i) => ({ ...ellipse(190, 150, -90 + i * 30), s: 0.19, from: RING1[Math.round(i / 2) % 6] }));
const CLONES = [...RING1, ...RING2];

const Mini = () => (
  <>
    <rect className="ls-cwin" x="-110" y="-80" width="220" height="160" rx="14" />
    {BLOCKS.map((b, i) => (
      <rect key={i} className={`ls-cblk${i === 0 ? ' ls-first' : ''}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="5" />
    ))}
  </>
);

// "Stage": the steps sit on a half circle around one illustration, and the words of the current step sit below it, changes shape from step to step instead of being
// swapped. The bulb's glow gives way to a screen whose blocks fly out of the spark, the same blocks are ticked off by a
// test sweep, and the finished screen is copied into a network. 
export default function LabStage({ heading, variant = 'arc' }: { heading: string; onStart: () => void; variant?: 'arc' | 'line' }) {
  const line = variant === 'line';
  const dots = line ? LINE_DOTS : DOTS;
  const [wrapRef, inView] = useInView<HTMLDivElement>();
  const [active, setActive] = useCycle(STEPS.length, CYCLE_MS, !inView);

  const [fill, setFill] = useState({ f: 0, ms: 0, ease: 'ease' });

  // The coloured part of the arc runs to the current dot, then (while timed) on towards the next one over the step's time; after the last dot it runs on to the end of the arc.
  const timed = inView;
  useEffect(() => {
    setFill({ f: dots[active].f, ms: 500, ease: 'cubic-bezier(.2,.8,.2,1)' });
    if (!timed) return;
    const t = setTimeout(() => setFill({ f: active < LAST ? dots[active + 1].f : 1, ms: CYCLE_MS - 600, ease: 'linear' }), 520);
    return () => clearTimeout(t);
  }, [active, timed, dots]);

  const stageCls = ['ls-stage', ...[1, 2, 3].filter((n) => active >= n).map((n) => `ls-r${n}`)].join(' ');

  return (
    <section className={`ls${line ? ' ls-v2' : ''}${inView ? '' : ' is-off'}`} id="labs">
      <div className="container">
        <Reveal className="section-head">
          <h2>{heading}</h2>
        </Reveal>

        <div ref={wrapRef} className="ls-wrap">
          <div
            className="ls-pin"
          >
            <svg className="ls-arc" width={line ? 1 : R} height={line ? LINE_H : 2 * R} aria-hidden="true">
              <path className="ls-arc-base" d={line ? LINE : ARC} />
              <path className="ls-arc-fill" d={line ? LINE : ARC} pathLength={1} style={{ strokeDasharray: '1 2', strokeDashoffset: 1 - fill.f, transition: `stroke-dashoffset ${fill.ms}ms ${fill.ease}` }} />
            </svg>

            <ol className="ls-rail">
              {STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className={`ls-item${i === active ? ' is-active' : ''}${i < active ? ' is-done' : ''}`}
                  style={{ ['--x' as string]: dots[i].x, ['--y' as string]: dots[i].y }}
                >
                  <button type="button" className="ls-btn" aria-pressed={i === active} aria-current={i === active ? 'step' : undefined} onClick={() => setActive(i)}>
                    <span className="ls-dot" aria-hidden="true" />
                    <span className="ls-name">{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className={stageCls} data-step={active}>
              <svg className="ls-svg" viewBox="0 0 480 380" aria-hidden="true">
                <defs>
                  <radialGradient id="ls-glow-g">
                    <stop offset="0" stopColor="#dcae3a" stopOpacity=".38" />
                    <stop offset="1" stopColor="#dcae3a" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <g transform="translate(240 190)">
                  {/* step 3: links, then the copies of the screen */}
                  {CLONES.map((c, i) => (
                    <line key={`k${i}`} className="ls-link" pathLength={1} x1={c.from.x} y1={c.from.y} x2={c.x} y2={c.y} style={{ ['--i' as string]: i }} />
                  ))}
                  {CLONES.map((c, i) => (
                    <g key={`c${i}`} className="ls-clone" style={{ ['--dx' as string]: `${c.x}px`, ['--dy' as string]: `${c.y}px`, ['--s' as string]: c.s, ['--i' as string]: i }}>
                      <Mini />
                    </g>
                  ))}

                  {/* step 0: the spark */}
                  <g className="ls-glow">
                    <circle className="ls-glow-c" r="104" fill="url(#ls-glow-g)" />
                  </g>
                  {[0, 1, 2].map((r) => (
                    <circle key={r} className="ls-rip" r="44" style={{ ['--r' as string]: r }} />
                  ))}

                  {/* steps 1 to 3: the screen, its blocks, its ticks. It shrinks into the hub of the network */}
                  <g className="ls-screen">
                    <rect className="ls-paper" x="-110" y="-80" width="220" height="160" rx="14" />
                    <rect className="ls-frame" pathLength={1} x="-110" y="-80" width="220" height="160" rx="14" />
                    <g className="ls-chrome">
                      <circle className="ls-wdot" cx="-96" cy="-69" r="2.8" />
                      <circle className="ls-wdot" cx="-85" cy="-69" r="2.8" />
                      <circle className="ls-wdot" cx="-74" cy="-69" r="2.8" />
                      <line className="ls-wline" x1="-110" y1="-58" x2="110" y2="-58" />
                    </g>
                    {BLOCKS.map((b, i) => (
                      <rect key={`g${i}`} className="ls-ghost" x={b.x} y={b.y} width={b.w} height={b.h} rx="5" style={{ ['--gd' as string]: `${(0.9 + i * 0.5).toFixed(1)}s` }} />
                    ))}
                    {BLOCKS.map((b, i) => (
                      <rect
                        key={`b${i}`}
                        className={`ls-blk${i === 0 ? ' ls-first' : ''}`}
                        x={b.x}
                        y={b.y}
                        width={b.w}
                        height={b.h}
                        rx="5"
                        style={{ ['--bx' as string]: `${-(b.x + b.w / 2)}px`, ['--by' as string]: `${-(b.y + b.h / 2)}px`, ['--i' as string]: i }}
                      />
                    ))}
                    <rect className="ls-scan" x="-98" y="-56" width="196" height="2.5" rx="1.2" />
                    <rect className="ls-track" x="-98" y="56" width="196" height="6" rx="3" />
                    <rect className="ls-meter" x="-98" y="56" width="196" height="6" rx="3" />
                    {BADGES.map((p, i) => (
                      <g key={i} transform={`translate(${p.x} ${p.y})`}>
                        <g className="ls-badge" style={{ ['--td' as string]: `${p.d}s` }}>
                          <circle r="9" />
                          <path d="M-4.4 .4-1.2 3.7 4.6-3" />
                        </g>
                      </g>
                    ))}
                  </g>
                  <circle className="ls-pulse" r="34" />

                  <g className="ls-bulb">
                    <g transform="translate(-31 -31) scale(2.6)">
                      <path d="M9 18h6M10 21h4" />
                      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.2 1.1 2.2h5c0-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3Z" />
                    </g>
                  </g>
                  <path className="ls-cursor" d="M0 0 0 17 4.8 12.6 8.2 20 11.6 18.6 8.3 11.3 14.6 11.3Z" />
                </g>
              </svg>
            </div>

            <div className={`ls-copy${active === LAST ? ' is-low' : ''}`} aria-live="polite">
              <p key={active}>{STEPS[active].text}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
