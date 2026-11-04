import type { GlobalConfig } from 'payload'

// Content of the /services page: a heading, then groups of services. Each group becomes a tab and a section.
export const Services: GlobalConfig = {
  slug: 'services',
  label: 'Services page',
  access: { read: () => true },
  fields: [
    { name: 'tag', type: 'text', admin: { description: 'Small gold label above the page heading.' } },
    { name: 'heading', type: 'text', required: true, admin: { description: 'The last word is shown in the gold accent.' } },
    { name: 'lede', type: 'textarea' },
    {
      name: 'groups',
      type: 'array',
      admin: { description: 'The sections of the page, in order. Each one gets a tab at the top.' },
      fields: [
        { name: 'key', type: 'text', required: true, admin: { description: 'Short id used in the link, for example ai' } },
        { name: 'tag', type: 'text', required: true, admin: { description: 'Label on the tab and above the section heading.' } },
        { name: 'title', type: 'text', required: true },
        { name: 'tagline', type: 'text' },
        {
          name: 'services',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              required: true,
              admin: { description: 'Used in the link to this service, for example cloud-engineering' },
            },
            { name: 'description', type: 'textarea', required: true },
            { name: 'aiEdge', type: 'text', label: 'AI edge', admin: { description: 'Optional one-liner on how AI is used.' } },
          ],
        },
      ],
    },
    { name: 'closingHeading', type: 'text' },
    { name: 'closingText', type: 'text' },
  ],
}
