@AGENTS.md

# People10 homepage

Next.js (App Router, Turbopack) with Payload CMS 3 embedded in the same app and SQLite for storage. The homepage and its
copy, images and videos are edited in the Payload admin at `/admin`; the page is rendered per request (`force-dynamic`).

## Commands

```bash
npm run dev            # http://localhost:3000 (3001 if 3000 is taken); admin at /admin
npm run seed           # load the starter content + media into an EMPTY database (skips if media already exists)
npm run build
npx tsc --noEmit       # type-check; run it after every change
npm run lint
npm run generate:types # after changing a collection or global
npm run reset-password # reset the admin password (see src/reset-password.ts)
```

- Needs a `.env` (copy `.env.example`): `PAYLOAD_SECRET` (any long random string) and `DATABASE_URL=file:./p10.db`.
  Without the secret every page 500s with "missing secret key".
- A fresh database is **empty**, and `npm run dev` does not seed it, so the homepage shows no logos or footer until you
  run `npm run seed`. To re-seed, delete `p10.db` and `media/`, then run `npm run seed` again.
  `scripts/start.sh` (the container entrypoint) does `payload migrate` + seed on boot.
- `npm install` on this machine rewrites `package-lock.json`. Unless dependencies really changed, revert it with
  `git checkout package-lock.json`.

## How the page gets its data

`src/payload.config.ts` defines the CMS. Content lives in three globals (`src/globals/`: `Homepage`, `SiteSettings`,
`Services`) plus the `Media` and `Users` collections (`src/collections/`).

`src/lib/homepage.ts` reads the globals through Payload's local API and returns the lean `HomeData` view object.
`src/app/(frontend)/page.tsx` passes it to `src/components/HomeClient.tsx`, which lays out the sections in order. Section
components live in `src/components/`; most take a slice of `HomeData` as props.

- Copy is written without trailing full stops; `noStop()` in `homepage.ts` enforces it. Keep new copy in that style.
- To add or change an editable field: edit the global, add a migration in `src/migrations/` (the container runs
  `payload migrate` on boot), run `npm run generate:types`, update `homepage.ts` and the seed JSON.
- Starter content is `src/seed-data/*.json`. Media in it is written as `{ "$media": "<file name>", "alt": "…" }`; the file
  is found anywhere under `seed-assets/` (`src/seed.ts`).
- Scroll-in animation: wrap content in `Reveal` (`src/components/Reveal.tsx`, uses `src/hooks/useReveal.ts`).
- `LabVideo.tsx` is the shared video player (hover controls: play/pause, seek, sound; optional autoplay).

## Styling

All CSS is in **one file**: `src/app/(frontend)/styles.css`. No CSS modules, no Tailwind. Section styles are grouped under
comment headers; add new ones next to the section they belong to.

- **Type scale: use the levels, never invent sizes.** `:root` defines `--fs-h1` … `--fs-h6` (h1 hero, h2 section headings,
  h3 titles, h4 subtitles, h5 body, h6 labels). Titles inside cards must sit below the hero's h1.
  `TYPOGRAPHY.md` is out of date; the variables in `styles.css` are the truth. Font is Inter via `next/font`.
- **Brand colours** come from the logo: ink `--ink` (#071018) and ochre `--ochre` (#b8860b), with `--ochre-tint`,
  brown `--cta` for buttons, `--blue` for the occasional accent, `--paper`/white backgrounds, `--line` borders.
  Keep new UI warm/ink/white; avoid introducing unrelated colours (e.g. a cyan/navy theme looked off-brand).
- Spacing tokens: `--section-pad`, `--gutter`, `--max` (content width 1240px), `--radius`.
- Match the file's style: compact one-line rules, short comments that say why.
- Respect `prefers-reduced-motion` for new animation. Pin/scroll effects use `position: sticky` + a small scroll
  handler, not an animation library.

## Deploy (Fly.io)

`Dockerfile`, `fly.toml` and `scripts/start.sh` are set up for Fly: one 1 GB machine, with the SQLite DB and uploaded media
on a volume at `/data` (`DATABASE_URL=file:/data/p10.db`, `MEDIA_DIR=/data/media`). Keep it to a single machine (the volume
is per machine). There is **no CI/auto-deploy workflow** in the repo.

- `fly.toml` names the app `p10-design-v2`. That app belongs to whoever deployed it; check with them before running
  `fly deploy` against that name, and use your own app name for personal deploys.
- `railway.json` / `.railwayignore` are also in the repo; they are separate from the Fly setup.
- GitHub Pages cannot host this app as is (dynamic pages, API routes, SQLite). It would need a static snapshot build.

## Working in this repo

- Design branches (`v5`, `v6`, `design-v2`, …) are shared; do not push to or rewrite someone else's branch without asking.
- Previewing: run `npm run dev` (a `.claude/launch.json` that does this is not committed). `html` has `scroll-behavior: smooth`, so use
  `scrollTo({ behavior: 'instant' })` when scripting scrolls. Videos are about 10 MB each, so autoplay only when visible.
- Personal preferences and work in progress go in `CLAUDE.local.md` (git-ignored), not here.
