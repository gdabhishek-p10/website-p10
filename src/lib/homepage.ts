import config from '@payload-config'
import { getPayload } from 'payload'

import type { Media } from '@/payload-types'

type MediaRef = number | Media | null | undefined

export interface Img {
  url: string
  alt: string
  width: number | null
  height: number | null
}

export interface Link {
  label: string
  href: string
  external: boolean
}

function img(m: MediaRef): Img | null {
  if (!m || typeof m === 'number' || !m.url) return null
  return { url: m.url, alt: m.alt, width: m.width ?? null, height: m.height ?? null }
}

function links(list: { label: string; href: string; external?: boolean | null }[] | null | undefined): Link[] {
  return (list ?? []).map((l) => ({ label: l.label, href: l.href, external: Boolean(l.external) }))
}

const texts = (list: { text: string }[] | null | undefined) => (list ?? []).map((c) => c.text)

export async function getHomeData(draft = false) {
  const payload = await getPayload({ config })
  const [home, settings] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1, draft }),
    payload.findGlobal({ slug: 'site-settings', depth: 0, draft }),
  ])

  return {
    header: {
      navLinks: links(settings.header?.navLinks),
      ctaLabel: settings.header?.ctaLabel ?? 'Talk to us',
      ctaHref: settings.header?.ctaHref ?? '#contact',
    },
    footer: {
      columns: (settings.footer?.columns ?? []).map((c) => ({ title: c.title, links: links(c.links) })),
      copyright: settings.footer?.copyright ?? '',
      tagline: settings.footer?.tagline ?? '',
    },
    hero: {
      before: home.hero.headlineBefore,
      accent: home.hero.headlineAccent,
      after: home.hero.headlineAfter,
      lede: home.hero.lede,
      prompts: texts(home.hero.prompts),
    },
    logos: (home.clients?.logos ?? []).flatMap((l) => {
      const i = img(l.logo)
      return i ? [i] : []
    }),
    problem: {
      heading: home.problem.heading,
      lede: home.problem.lede ?? '',
      image: img(home.problem.image),
      items: (home.problem.items ?? []).map((i) => ({
        icon: i.icon,
        label: i.label,
        headline: i.headline,
        description: i.description,
      })),
    },
    pillars: {
      heading: home.pillars.heading,
      lede: home.pillars.lede ?? '',
      items: (home.pillars.items ?? []).map((p) => ({
        key: p.key,
        title: p.title,
        body: p.body,
        chips: texts(p.chips),
      })),
    },
    engineering: {
      heading: home.engineering.heading,
      lede: home.engineering.lede ?? '',
      diagram: img(home.engineering.diagram),
    },
    caseStudies: {
      heading: home.caseStudies.heading,
      lede: home.caseStudies.lede ?? '',
      items: (home.caseStudies.items ?? []).flatMap((c) => {
        const image = img(c.image)
        if (!image) return []
        return [
          {
            theme: c.theme,
            tag: c.tag,
            title: c.title,
            desc: c.desc ?? '',
            image,
            video: img(c.video)?.url ?? null,
            storyUrl: c.storyUrl || '#',
          },
        ]
      }),
    },
    aiLabs: {
      heading: home.aiLabs.heading,
      lede: home.aiLabs.lede ?? '',
      entries: (home.aiLabs.entries ?? []).flatMap((e, idx) => {
        const video = img(e.video)
        const poster = img(e.poster)
        if (!video || !poster) return []
        return [
          {
            key: `${idx}`,
            tabLabel: e.tabLabel,
            name: e.name,
            head: e.head,
            copy: e.copy,
            chips: texts(e.chips),
            url: e.url ?? '',
            video: video.url,
            poster: poster.url,
          },
        ]
      }),
    },
    industries: {
      heading: home.industries.heading,
      lede: home.industries.lede ?? '',
      items: (home.industries.items ?? []).map((i) => i.name),
    },
  }
}

export type HomeData = Awaited<ReturnType<typeof getHomeData>>
