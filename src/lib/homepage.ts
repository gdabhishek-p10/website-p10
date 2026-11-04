import config from '@payload-config'
import { getPayload } from 'payload'

import type { Media } from '@/payload-types'
import { industriesMenuFrom, links, type Link } from './links'
import { getServicesMenu } from './services'

export type { Link }

const PILLAR_ORDER = ['ai', 'build', 'modernize']

// Single-line statements carry no trailing full stop; multi-sentence copy is left as written
const noStop = (t: string) => (/\.$/.test(t) && !/\.\s/.test(t) ? t.slice(0, -1) : t)

type MediaRef = number | Media | null | undefined

export interface Img {
  url: string
  alt: string
  width: number | null
  height: number | null
}

function img(m: MediaRef): Img | null {
  if (!m || typeof m === 'number' || !m.url) return null
  return { url: m.url, alt: m.alt, width: m.width ?? null, height: m.height ?? null }
}

const texts = (list: { text: string }[] | null | undefined) => (list ?? []).map((c) => c.text)

export async function getHomeData(draft = false) {
  const payload = await getPayload({ config })
  const [home, settings, servicesMenu] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1, draft }),
    payload.findGlobal({ slug: 'site-settings', depth: 0, draft }),
    getServicesMenu(),
  ])

  return {
    header: {
      navLinks: links(settings.header?.navLinks),
      ctaLabel: settings.header?.ctaLabel ?? 'Talk to us',
      ctaHref: settings.header?.ctaHref ?? '#contact',
      servicesMenu,
      industriesMenu: industriesMenuFrom(texts(home.industries.items?.map((i) => ({ text: i.name })))),
      // the links of the footer column called About (or Company): they also form the dropdown under About in the top menu
      aboutMenu: links((settings.footer?.columns ?? []).find((c) => /^(about|company)$/i.test(c.title.trim()))?.links),
    },
    footer: {
      columns: (settings.footer?.columns ?? []).map((c) => ({ title: c.title, links: links(c.links) })),
      copyright: settings.footer?.copyright ?? '',
      tagline: settings.footer?.tagline ?? '',
    },
    hero: {
      before: home.hero.headlineBefore ?? '',
      accent: home.hero.headlineAccent ?? '',
      after: home.hero.headlineAfter ?? '',
      lede: noStop(home.hero.lede),
      prompts: texts(home.hero.prompts),
    },
    logos: (home.clients?.logos ?? []).flatMap((l) => {
      const i = img(l.logo)
      return i ? [i] : []
    }),
    problem: {
      heading: home.problem.heading,
      lede: noStop(home.problem.lede ?? ''),
      image: img(home.problem.image),
      items: (home.problem.items ?? []).map((i) => ({
        icon: i.icon,
        label: i.label,
        headline: i.headline,
        description: noStop(i.description),
      })),
    },
    pillars: {
      heading: home.pillars.heading,
      lede: noStop(home.pillars.lede ?? ''),
      items: [...(home.pillars.items ?? [])]
        .sort((x, y) => PILLAR_ORDER.indexOf(x.key) - PILLAR_ORDER.indexOf(y.key))
        .map((p) => ({
        key: p.key,
        title: p.title,
        body: noStop(p.body),
        chips: texts(p.chips),
      })),
    },
    engineering: {
      heading: home.engineering.heading,
      lede: noStop(home.engineering.lede ?? ''),
      diagram: img(home.engineering.diagram),
    },
    caseStudies: {
      heading: home.caseStudies.heading,
      lede: noStop(home.caseStudies.lede ?? ''),
      items: (home.caseStudies.items ?? []).flatMap((c) => {
        const image = img(c.image)
        if (!image) return []
        return [
          {
            theme: c.theme,
            tag: c.tag,
            title: c.title,
            desc: noStop(c.desc ?? ''),
            image,
            video: img(c.video)?.url ?? null,
            storyUrl: c.storyUrl || '#',
          },
        ]
      }),
    },
    aiLabs: {
      heading: home.aiLabs.heading,
      lede: noStop(home.aiLabs.lede ?? ''),
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
            copy: noStop(e.copy),
            impactLabel: e.impactLabel ?? '',
            impactHeadline: e.impactHeadline ?? '',
            metrics: (e.metrics ?? []).map((m) => ({ icon: m.icon, label: m.label })),
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
      lede: noStop(home.industries.lede ?? ''),
      items: (home.industries.items ?? []).map((i) => i.name),
    },
  }
}

export type HomeData = Awaited<ReturnType<typeof getHomeData>>
