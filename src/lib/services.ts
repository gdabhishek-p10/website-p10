import config from '@payload-config'
import { getPayload } from 'payload'

import { industriesMenuFrom, links } from './links'
import { SERVICES_DEFAULTS, type ServicesData } from './servicesDefaults'

export type { ServicesData }

// Page content from the CMS; if that section is empty (or not set up yet), the built-in platter is used.
export async function getServicesData(): Promise<ServicesData> {
  try {
    const payload = await getPayload({ config })
    const doc = await payload.findGlobal({ slug: 'services', depth: 0 })
    const groups = (doc.groups ?? [])
      .map((g) => ({
        key: g.key,
        tag: g.tag,
        title: g.title,
        tagline: g.tagline ?? '',
        services: (g.services ?? []).map((s) => ({
          name: s.name,
          slug: s.slug,
          description: s.description,
          aiEdge: s.aiEdge || undefined,
        })),
      }))
      .filter((g) => g.services.length > 0)
    if (groups.length === 0) return SERVICES_DEFAULTS
    return {
      tag: doc.tag ?? SERVICES_DEFAULTS.tag,
      heading: doc.heading || SERVICES_DEFAULTS.heading,
      lede: doc.lede ?? SERVICES_DEFAULTS.lede,
      groups,
      closingHeading: doc.closingHeading ?? SERVICES_DEFAULTS.closingHeading,
      closingText: doc.closingText ?? SERVICES_DEFAULTS.closingText,
    }
  } catch {
    return SERVICES_DEFAULTS
  }
}

// Names and anchors of every service, grouped, for the dropdown under "Services" in the header.
export interface ServicesMenu {
  groups: { key: string; tag: string; services: { name: string; slug: string }[] }[]
}

export async function getServicesMenu(): Promise<ServicesMenu> {
  const data = await getServicesData()
  return {
    groups: data.groups.map((g) => ({ key: g.key, tag: g.tag, services: g.services.map((s) => ({ name: s.name, slug: s.slug })) })),
  }
}

// Header and footer for pages other than the home page: in-page links like #contact must point back to the home page.
const toHome = (href: string) => (href.startsWith('#') ? `/${href}` : href)

export async function getChrome() {
  const payload = await getPayload({ config })
  const [settings, servicesMenu, home] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    getServicesMenu(),
    payload.findGlobal({ slug: 'homepage', depth: 0 }),
  ])
  const fix = <T extends { href: string }>(l: T): T => ({ ...l, href: toHome(l.href) })
  return {
    header: {
      navLinks: links(settings.header?.navLinks).map(fix),
      ctaLabel: settings.header?.ctaLabel ?? 'Talk to us',
      ctaHref: toHome(settings.header?.ctaHref ?? '#contact'),
      servicesMenu,
      industriesMenu: industriesMenuFrom((home.industries?.items ?? []).map((i) => i.name)),
      aboutMenu: links((settings.footer?.columns ?? []).find((c) => /^(about|company)$/i.test(c.title.trim()))?.links).map(fix),
    },
    footer: {
      columns: (settings.footer?.columns ?? []).map((c) => ({ title: c.title, links: links(c.links).map(fix) })),
      copyright: settings.footer?.copyright ?? '',
      tagline: settings.footer?.tagline ?? '',
    },
  }
}
