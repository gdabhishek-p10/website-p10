# Homepage Typography

## Font family
- **Primary:** Inter, self-hosted through `next/font/google` as a variable font (`layout.tsx`, `--font-inter`), with a system sans fallback. Weights 600, 650, 700, 750 and 800 are used.
- **Monospace** (code mockups): `ui-monospace, SFMono-Regular, Menlo, monospace`

## Type scale (`styles.css` `:root`)
| Token | Size | Used for |
|---|---|---|
| `--fs-h1` | `clamp(36px, 5.6vw, 64px)` | `h1` (line-height 1.08, tracking -0.065em, 700) |
| `--fs-h2` | `clamp(30px, 4vw, 50px)` | `h2` (1.08, -0.045em, 700) |
| `--fs-h3` | `clamp(22px, 2.2vw, 28px)` | `h3`, card and pillar titles (1.18, -0.03em, 700) |
| `--fs-h4` | `clamp(18px, 1.8vw, 22px)` | `h4`, `.lede` (1.2 / 1.45) |
| `--fs-h5` | `clamp(16px, 1.25vw, 18px)` | body text, `p`, nav links (1.5) |
| `--fs-h6` | 14px | buttons, labels, eyebrows, footer small print |

`--ts` is `1`; mockup sizes are written as `calc(Npx * var(--ts))`. No text is below 11px.

## Colour
| Token | Value | Use |
|---|---|---|
| `--ink` | `#071018` | headings (`h1`-`h4`) |
| `--text` | `#20282d` | body text |
| `--muted` | `#52656f` | secondary text (6.1:1 on white) |
| `--ochre` | `#b8860b` | accent. Gradient text runs `#a87806` to `#b8860b` (min 3.25:1, large text only). White text on gold uses `#8a5c00`. |

## Shape
`--r-card` 12px (cards, panels, bubbles), `--r-md` 8px (inner tiles, inputs), `--r-sm` 4px (small bars, badges, icon tiles). Pills stay `999px`, circles `50%`, 2px for hairline bars.

## Accessibility baseline
Skip link to `#main`, global `:focus-visible` ring (3px ochre), `:active` pressed state on buttons and links, 48px hit areas on the menu button, nav dropdown toggles and carousel arrows.

## Still to do (4.2, full Material 3 migration)
Colour roles, 15-role type scale, three weights, shape/elevation/motion tokens, state layers, 600/840/1200px breakpoints.
