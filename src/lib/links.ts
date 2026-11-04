export interface Link {
  label: string
  href: string
  external: boolean
}

export function links(list: { label: string; href: string; external?: boolean | null }[] | null | undefined): Link[] {
  return (list ?? []).map((l) => ({ label: l.label, href: l.href, external: Boolean(l.external) }))
}

// "Engineering & Manufacturing" -> "engineering-manufacturing"; used for the anchors in the Industries section and its menu.
export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export interface IndustryMenuItem {
  name: string
  slug: string
}

export const industriesMenuFrom = (names: string[]): IndustryMenuItem[] => names.map((name) => ({ name, slug: slugify(name) }))
