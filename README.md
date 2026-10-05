# People10 homepage — Next.js + Payload CMS

The People10 homepage, with every piece of copy, image, video and list editable in Payload CMS.
Payload runs embedded in the same Next.js app (admin at `/admin`, REST at `/api`, GraphQL at `/api/graphql`).

## Run it

```bash
npm install
cp .env.example .env        # then set PAYLOAD_SECRET to a long random string
npm run seed                # one-time: loads the current homepage content + media into SQLite
npm run dev                 # http://localhost:3000  (admin: /admin)
```

The first visit to `/admin` asks you to create the first admin user.

## Content model

| Where in admin | What it controls |
| --- | --- |
| **Globals → Homepage** | Tabs for Hero, Client logos, Problem framing, Pillars, Engineering + AI, Case studies, AI Labs, Industries |
| **Globals → Navigation & footer** | Header links and CTA, footer columns, copyright line |
| **Collections → Media** | Every image, video and logo (`alt` text is required) |

The diagrams beside each pillar (Modernize / Build / Apply AI) are code, chosen per pillar with the **Diagram** select.
Colours and layout live in `src/app/(frontend)/styles.css`.

## How the page gets its data

`src/lib/homepage.ts` reads both globals through Payload's local API and returns lean view objects.
`src/app/(frontend)/page.tsx` passes them to `HomeClient`, which renders the section components in `src/components/`.
The page is rendered on each request (`force-dynamic`), so edits in the admin show up immediately.

## Live preview and versions

Both globals (Homepage, Navigation & footer) have drafts, autosave and version history turned on.

- **Live preview:** open a global in the admin and click **Live Preview**. The real homepage loads beside the editor
  (Mobile / Tablet / Desktop switcher) and refreshes as your edits autosave. It is served in Next.js draft mode by
  `/preview`, which only works while you are logged in to the admin.
- **Drafts vs published:** autosave writes drafts only. Visitors keep seeing the last **published** version until you
  click **Publish changes**.
- **Versions:** the **Versions** tab lists every saved draft and published version. Open one to compare it with the
  current content, or restore it. The last 50 versions are kept.
- **Preview button:** opens the draft page full screen in a new tab.

## Database

Local development uses SQLite (`DATABASE_URL=file:./p10.db`). Uploaded files are stored in `./media`.
Before going live, switch to a hosted database (change the adapter in `src/payload.config.ts`) and
move uploads to object storage — a host with an ephemeral filesystem will lose both.

## Scripts

`dev` · `build` · `start` · `seed` · `generate:types` (after changing a collection/global) · `generate:importmap`
