# Homepage Typography

## Font family

- **Primary:** `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif` (`styles.css:11`)
- **Monospace** (code / terminal mockups): `ui-monospace, SFMono-Regular, Menlo, monospace`
- **Note:** Inter is not actually loaded. `layout.tsx` has no `next/font` import, `@font-face` or Google Fonts link, so visitors only see Inter if it is installed locally; otherwise the system sans fallback is used. Consider loading it via `next/font/google` (use the variable version, since weights 650/750/800 are used). Check `node_modules/next/dist/docs/` first, as this Next.js version has breaking changes.

## Base

| Property | Value |
|---|---|
| Body size | 17px |
| Smoothing | `-webkit-font-smoothing: antialiased` |
| Text color | `#20282d` (`--text`) |
| Heading color | `#071018` (`--ink`) |
| Muted color | `#000000` (`--muted`) |
| Accent (ochre) | `#b8860b` |

## Headings

| Element | Size | Line-height | Letter-spacing | Weight |
|---|---|---|---|---|
| `h1` | `clamp(51px, 8.2vw, 84px)` (mobile: `clamp(32px, 10vw, 51px)`) | 1.08 | -0.065em | 700 |
| `h2` | `clamp(37px, 4.2vw, 56px)` (mobile: `clamp(26px, 7vw, 37px)`) | 1.08 | -0.045em | 700 |
| `h3` | `clamp(28px, 6vw, 40px)` | 1.18 | -0.03em | 700 |
| `h4` | `clamp(24px, 5vw, 32px)` | 1.2 | -0.02em | 700 |

## Other recurring styles

| Selector | Size | Weight | Notes |
|---|---|---|---|
| `.lede` | 22px | – | line-height 1.45 |
| `.btn` | 16px | 750 | nav button: 14px / 600 |
| `.navlinks` | 15px | 500 | |
| `.eyebrow` | 12px | 800 | uppercase, letter-spacing 0.13em, ochre |
| `.case-tag` | 12px | 800 | uppercase, letter-spacing 0.13em, ochre |
| `.case h3` | 24px | 700 | line-height 1.25 |
| `.case-desc` | 14.5px | – | line-height 1.5 |
| `.lab-info h3` | 22px | 700 | line-height 1.25 |
| `.lab-info p` | 15.5px | – | line-height 1.55 |
| `.chip` | 14px | 700 | |
| `.industry-name` | 16.5px | 650 | letter-spacing -0.01em |
| `.footer-col strong` | 12px | 800 | uppercase, letter-spacing 0.1em |
| `.footer-col a` | 13px | – | color `#3d474d` |
| `.footer-bottom` | 13px | – | |

## Animated mockups

Classes `.et-*`, `.sd-*`, `.er-*`, `.ew-*`, `.ecyc-*` use sizes from 8px up to 76px (`.er-hub-name`). Weights are mostly 650–800, with tight negative letter-spacing on large text and wide positive spacing (0.09–0.14em) on uppercase micro-labels.
