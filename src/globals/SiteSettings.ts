import type { Field, GlobalConfig } from 'payload'

const link: Field[] = [
  { name: 'label', type: 'text', required: true },
  { name: 'href', type: 'text', required: true },
  { name: 'external', type: 'checkbox', defaultValue: false, label: 'Opens in a new tab' },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Navigation & footer',
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  versions: {
    max: 50,
    drafts: { autosave: { interval: 375 } },
  },
  admin: {
    preview: () => '/preview?path=/',
  },
  fields: [
    {
      type: 'ui',
      name: 'previewSectionSync',
      admin: { components: { Field: '/components/admin/PreviewSectionSync' } },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          name: 'header',
          fields: [
            { name: 'navLinks', type: 'array', fields: link },
            { name: 'ctaLabel', type: 'text', required: true },
            { name: 'ctaHref', type: 'text', required: true },
          ],
        },
        {
          label: 'Footer',
          name: 'footer',
          fields: [
            {
              name: 'columns',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'links', type: 'array', fields: link },
              ],
            },
            { name: 'copyright', type: 'text', required: true },
            { name: 'tagline', type: 'text' },
          ],
        },
      ],
    },
  ],
}
