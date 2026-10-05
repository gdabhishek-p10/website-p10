import type { Field, GlobalConfig } from 'payload'

const chips = (description?: string): Field => ({
  name: 'chips',
  type: 'array',
  admin: { description },
  fields: [{ name: 'text', type: 'text', required: true }],
})

const heading = (): Field => ({ name: 'heading', type: 'text', required: true })
const lede = (required = false): Field => ({ name: 'lede', type: 'textarea', required })

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
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
          label: 'Hero',
          name: 'hero',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'headlineBefore', type: 'text', required: true, admin: { width: '33%' } },
                {
                  name: 'headlineAccent',
                  type: 'text',
                  required: true,
                  admin: { width: '33%', description: 'Shown in the ochre accent colour.' },
                },
                { name: 'headlineAfter', type: 'text', required: true, admin: { width: '33%' } },
              ],
            },
            lede(true),
            {
              name: 'prompts',
              type: 'array',
              admin: { description: 'Example prompts that type themselves out in the hero chat box.' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Client logos',
          name: 'clients',
          fields: [
            {
              name: 'logos',
              type: 'array',
              fields: [{ name: 'logo', type: 'upload', relationTo: 'media', required: true }],
            },
          ],
        },
        {
          label: 'Problem framing',
          name: 'problem',
          fields: [
            heading(),
            lede(),
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              name: 'items',
              type: 'array',
              maxRows: 3,
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  defaultValue: 'systems',
                  options: [
                    { label: 'Servers (existing systems)', value: 'systems' },
                    { label: 'Code (what is next)', value: 'next' },
                    { label: 'Sparkles (AI)', value: 'ai' },
                  ],
                  admin: { description: 'The AI icon is drawn in the ochre accent colour.' },
                },
                { name: 'label', type: 'text', required: true },
                { name: 'headline', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Pillars',
          name: 'pillars',
          fields: [
            heading(),
            lede(),
            {
              name: 'items',
              type: 'array',
              maxRows: 3,
              fields: [
                {
                  name: 'key',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Modernize (flow diagram)', value: 'modernize' },
                    { label: 'Build (product diagram)', value: 'build' },
                    { label: 'Apply AI (hub diagram)', value: 'ai' },
                  ],
                  admin: { description: 'Chooses which diagram is shown beside the text.' },
                },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
                chips('Small labels shown under the body text.'),
              ],
            },
          ],
        },
        {
          label: 'Engineering + AI',
          name: 'engineering',
          fields: [heading(), lede(), { name: 'diagram', type: 'upload', relationTo: 'media' }],
        },
        {
          label: 'Case studies',
          name: 'caseStudies',
          fields: [
            heading(),
            lede(),
            {
              name: 'items',
              type: 'array',
              fields: [
                {
                  name: 'theme',
                  type: 'select',
                  required: true,
                  defaultValue: 'dark',
                  options: [
                    { label: 'Dark card', value: 'dark' },
                    { label: 'Light card', value: 'light' },
                  ],
                },
                { name: 'tag', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'desc', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'Optional. Adds a play button that opens the video.' },
                },
                { name: 'storyUrl', type: 'text', admin: { description: 'Where "Read story" links to.' } },
              ],
            },
          ],
        },
        {
          label: 'AI Labs',
          name: 'aiLabs',
          fields: [
            heading(),
            lede(),
            {
              name: 'entries',
              type: 'array',
              fields: [
                { name: 'tabLabel', type: 'text', required: true },
                { name: 'name', type: 'text', required: true },
                { name: 'head', type: 'text', required: true },
                { name: 'copy', type: 'textarea', required: true },
                chips(),
                {
                  name: 'url',
                  type: 'text',
                  admin: { description: 'Optional. If empty, the link plays the demo video instead.' },
                },
                { name: 'video', type: 'upload', relationTo: 'media', required: true },
                { name: 'poster', type: 'upload', relationTo: 'media', required: true },
              ],
            },
          ],
        },
        {
          label: 'Industries',
          name: 'industries',
          fields: [
            heading(),
            lede(),
            {
              name: 'items',
              type: 'array',
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
