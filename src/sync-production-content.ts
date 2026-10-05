import 'dotenv/config'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { getPayload } from 'payload'

import config from './payload.config'

/**
 * One-off / re-runnable content sync: mirrors Homepage, Site Settings and Media
 * from the live production site's public REST API into the local database.
 *
 * Only reads production over HTTP (its public, published-only API) — never touches
 * Railway infrastructure. Only writes to the LOCAL database (DATABASE_URL from .env).
 *
 * Does not touch app code (e.g. the enterprise-transformation animation), and does
 * not touch the local Users collection.
 *
 * Run: npx tsx src/sync-production-content.ts
 */
const PROD = process.env.SYNC_SOURCE_URL || 'https://payload-app-production-5836.up.railway.app'

type ProdMedia = { id: number; alt: string; url: string; filename: string }

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`)
  return res.json() as Promise<T>
}

async function fetchAllMedia(): Promise<ProdMedia[]> {
  const out: ProdMedia[] = []
  let page = 1
  for (;;) {
    const data = await fetchJSON<{ docs: ProdMedia[]; hasNextPage: boolean }>(
      `${PROD}/api/media?limit=100&depth=0&page=${page}`,
    )
    out.push(...data.docs)
    if (!data.hasNextPage) break
    page += 1
  }
  return out
}

async function main() {
  console.log(`Syncing content from ${PROD} into local database...`)
  const payload = await getPayload({ config })

  const [prodMedia, prodHomepage, prodSiteSettings] = await Promise.all([
    fetchAllMedia(),
    fetchJSON<Record<string, unknown>>(`${PROD}/api/globals/homepage?depth=0`),
    fetchJSON<Record<string, unknown>>(`${PROD}/api/globals/site-settings?depth=0`),
  ])
  console.log(`Fetched ${prodMedia.length} media docs, homepage and site-settings from production.`)

  // Replace local media wholesale so local media stays in lockstep with production.
  const existing = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'media', id: doc.id })
  }
  console.log(`Cleared ${existing.docs.length} local media docs.`)

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p10-sync-'))
  const idMap = new Map<number, number>() // production media id -> local media id

  for (const m of prodMedia) {
    const fileRes = await fetch(`${PROD}${m.url}`)
    if (!fileRes.ok) {
      console.warn(`  skip ${m.filename}: download failed (${fileRes.status})`)
      continue
    }
    const tmpFile = path.join(tmpDir, m.filename)
    fs.writeFileSync(tmpFile, Buffer.from(await fileRes.arrayBuffer()))
    const created = await payload.create({ collection: 'media', data: { alt: m.alt }, filePath: tmpFile })
    idMap.set(m.id, created.id as number)
    fs.unlinkSync(tmpFile)
  }
  fs.rmdirSync(tmpDir)
  console.log(`Recreated ${idMap.size} media docs locally.`)

  // Remap the media relation fields (see src/payload-types.ts for the field list).
  const remap = (id: unknown) => (typeof id === 'number' ? (idMap.get(id) ?? id) : id)
  const h = prodHomepage as any

  if (h.clients?.logos) h.clients.logos = h.clients.logos.map((l: any) => ({ ...l, logo: remap(l.logo) }))
  if (h.problem?.image !== undefined) h.problem.image = remap(h.problem.image)
  if (h.engineering?.diagram !== undefined) h.engineering.diagram = remap(h.engineering.diagram)
  if (h.caseStudies?.items) {
    h.caseStudies.items = h.caseStudies.items.map((c: any) => ({
      ...c,
      image: remap(c.image),
      video: c.video !== undefined ? remap(c.video) : c.video,
    }))
  }
  if (h.aiLabs?.entries) {
    h.aiLabs.entries = h.aiLabs.entries.map((e: any) => ({
      ...e,
      video: remap(e.video),
      poster: remap(e.poster),
    }))
  }

  const strip = (o: Record<string, unknown>) => {
    const { id, updatedAt, createdAt, globalType, ...rest } = o
    return rest
  }

  await payload.updateGlobal({ slug: 'homepage', data: { ...strip(h), _status: 'published' } })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { ...strip(prodSiteSettings), _status: 'published' },
  })

  console.log('Synced homepage and site-settings content.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
