import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from './payload.config'
import homepage from './seed-data/homepage.json'
import siteSettings from './seed-data/site-settings.json'

// Starter content for a fresh database: the homepage and site settings as they stand in the CMS (exported from
// p10-design-v5). Any media in that content is written as { "$media": "<file name>", "alt": "…" }; the file is found
// anywhere under seed-assets/, uploaded once, and the reference replaced with its id.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'seed-assets')

type MediaRef = { $media: string; alt: string }
const isMediaRef = (v: unknown): v is MediaRef => typeof v === 'object' && v !== null && '$media' in v

// every seed asset by file name, whichever folder it sits in
function indexAssets(dir: string, found = new Map<string, string>()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) indexAssets(full, found)
    else found.set(entry.name, full)
  }
  return found
}

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'media' })
  if (existing.totalDocs > 0) {
    console.log('Media already exists — seed skipped. Delete p10.db and /media to re-seed.')
    process.exit(0)
  }

  const assets = indexAssets(root)
  const uploaded = new Map<string, number>()
  const upload = async ({ $media, alt }: MediaRef) => {
    if (!uploaded.has($media)) {
      const filePath = assets.get($media)
      if (!filePath) throw new Error(`Seed asset not found: ${$media}`)
      const doc = await payload.create({ collection: 'media', data: { alt }, filePath })
      uploaded.set($media, doc.id)
    }
    return uploaded.get($media)!
  }

  // swap every media reference for the id of its uploaded file, in order
  const resolve = async (v: unknown): Promise<unknown> => {
    if (isMediaRef(v)) return upload(v)
    if (Array.isArray(v)) {
      const out = []
      for (const item of v) out.push(await resolve(item))
      return out
    }
    if (typeof v === 'object' && v !== null) {
      const out: Record<string, unknown> = {}
      for (const [k, item] of Object.entries(v)) out[k] = await resolve(item)
      return out
    }
    return v
  }

  // the JSON is checked by the CMS at write time, so it is passed through as the global's data
  await payload.updateGlobal({ slug: 'homepage', data: (await resolve(homepage)) as never })
  await payload.updateGlobal({ slug: 'site-settings', data: (await resolve(siteSettings)) as never })

  console.log(`Seeded homepage content, site settings and ${uploaded.size} media files.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
