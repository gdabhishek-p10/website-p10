import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from './payload.config'
import logos from './seed-data/logos.json'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'seed-assets')
const STORY_URL = 'https://people10.com/category/success-stories/'

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'media' })
  if (existing.totalDocs > 0) {
    console.log('Media already exists — seed skipped. Delete p10.db and /media to re-seed.')
    process.exit(0)
  }

  const upload = async (file: string, alt: string) => {
    const doc = await payload.create({ collection: 'media', data: { alt }, filePath: path.join(root, file) })
    return doc.id
  }
  const chips = (list: string[]) => list.map((text) => ({ text }))

  const m = {
    enterprise: await upload(
      'poster/enterprise-transformation.jpg',
      'Sketched enterprise architecture diagram on a desk, mapping channels, business capabilities, applications, data and infrastructure, with notes on strategic outcomes and key considerations',
    ),
    engDiagram: await upload(
      'case/engineering-ai-diagram.png',
      'Diagram showing Enterprise systems, Products & platforms, and Data & cloud feeding into a central AI hub, which connects out to Integration, Automation, and Machine learning',
    ),
    cdssImg: await upload('poster/ai-cdss.jpg', 'AI-CDSS clinical decision support interface showing recommended treatment plan'),
    wmsImg: await upload(
      'case/multi-tenant-architecture.png',
      'Diagram of multi-tenant architecture: shared infrastructure serving multiple tenants through a centrally managed cloud application',
    ),
    baggageImg: await upload('poster/baggage-recovery.jpg', 'Baggage recovery app showing AI-ranked scan match confidence scores'),
    equipImg: await upload('poster/equipment-troubleshooting.jpg', 'Equipment troubleshooting copilot console'),
    cdssVideo: await upload('video/ai-cdss.mp4', 'AI clinical decision support demo'),
    baggageVideo: await upload('video/baggage-recovery.mp4', 'AI baggage recovery demo'),
    equipVideo: await upload('video/equipment-troubleshooting.mp4', 'Equipment troubleshooting copilot demo'),
  }

  const logoIds: { logo: number }[] = []
  for (const l of logos) logoIds.push({ logo: await upload(`logos/${l.file}`, l.alt) })

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      _status: 'published',
      hero: {
        headlineBefore: 'Engineering the',
        headlineAccent: 'Intelligent',
        headlineAfter: 'Enterprise',
        lede: 'Strengthen the systems you run, build what comes next, and apply AI where it creates measurable impact',
        prompts: chips([
          'Modernize our legacy ERP…',
          'Build a customer portal…',
          'Deploy an AI support agent…',
        ]),
      },
      clients: { logos: logoIds },
      problem: {
        heading: 'Enterprise transformation is not one problem',
        lede: 'Legacy systems, innovation needs, one budget',
        image: m.enterprise,
        items: [
          {
            icon: 'systems',
            label: 'Existing systems',
            headline: 'Make the systems you rely on work better',
            description: 'Reduce complexity and improve performance while creating a stronger foundation for what comes next',
          },
          {
            icon: 'next',
            label: "What's next",
            headline: 'Build what your business needs next',
            description: 'Create digital products and platforms that move from idea to launch faster and adapt as needs change',
          },
          {
            icon: 'ai',
            label: 'Where AI matters',
            headline: 'Apply AI where it changes the outcome',
            description: 'Bring AI into the workflows where it can reduce manual effort and improve decisions',
          },
        ],
      },
      pillars: {
        heading: 'Engineering where it matters most',
        lede: 'Engineering that improves what already works while helping create what comes next, with AI applied where it can change the outcome',
        items: [
          {
            key: 'ai',
            title: 'Apply AI for advantage and measurable value',
            body: 'AI that automates work, sharpens decisions, and turns into revenue, savings, and speed you can measure',
            chips: chips(['AI Strategy & Consulting', 'Agentic AI & Automation', 'Enterprise AI Integration', 'Generative AI', 'AI & Machine Learning']),
          },
          {
            key: 'build',
            title: 'Build products & platforms with AI',
            body: 'Products and platforms engineered with AI for faster launches, better customer experiences, and growth that lasts',
            chips: chips(['Product Engineering', 'Quality Engineering', 'IoT & Emerging Tech', 'Dedicated Teams']),
          },
          {
            key: 'modernize',
            title: 'Modernize the systems you run on',
            body: 'Cut the cost and risk of legacy systems, and free your teams to build what comes next',
            chips: chips(['Enterprise Software Dev', 'Legacy Modernization', 'Cloud Engineering', 'Data Engineering', 'System Integrations']),
          },
        ],
      },
      engineering: {
        heading: 'Engineering and AI, together',
        lede: 'AI is moving beyond code assistance to reshape the delivery workflow — from intent and specification to implementation, testing, and verification. Engineering is evolving from AI-assisted development toward AI-native and agentic delivery, with greater automation, continuous flow, and human oversight built into the process.',
        diagram: m.engDiagram,
      },
      caseStudies: {
        heading: 'Case studies',
        lede: 'Real examples of engineering and AI applied to business and operational challenges',
        items: [
          {
            theme: 'dark',
            tag: 'AI · Healthcare',
            title: '30% faster clinical decision making',
            desc: 'AI-recommended treatment plans, surfaced the moment vitals turn abnormal',
            image: m.cdssImg,
            video: m.cdssVideo,
            storyUrl: STORY_URL,
          },
          {
            theme: 'light',
            tag: 'Architecture',
            title: '3× more warehouse capacity on one platform',
            desc: 'One platform serving every tenant, without a re-platforming project',
            image: m.wmsImg,
            storyUrl: STORY_URL,
          },
          {
            theme: 'dark',
            tag: 'AI · Aviation',
            title: '25% faster baggage recovery',
            desc: 'AI-ranked scan matches point agents straight to the bag',
            image: m.baggageImg,
            video: m.baggageVideo,
            storyUrl: STORY_URL,
          },
        ],
      },
      aiLabs: {
        heading: 'AI labs',
        lede: 'Working experiments that turn emerging AI capabilities into practical enterprise applications',
        entries: [
          {
            tabLabel: 'Equipment Troubleshooting',
            name: 'Equipment Troubleshooting Copilot',
            head: 'Faster equipment troubleshooting',
            copy: 'An intelligent troubleshooting workspace that brings equipment data, technical knowledge, and diagnostic workflows together to help maintenance teams identify and resolve issues faster',
            chips: chips(['Agentic AI', 'RAG', 'Manufacturing']),
            url: 'https://people10.com/ai-powered-equipment-troubleshooting-copilot/',
            video: m.equipVideo,
            poster: m.equipImg,
          },
          {
            tabLabel: 'AI Clinical Decision Support',
            name: 'AI Clinical Decision Support',
            head: 'AI-assisted clinical decision support',
            copy: 'Proof of concept that consolidates patient data and abnormal vitals into one view, generating AI-recommended treatment plans and next steps for care teams',
            chips: chips(['Healthcare', 'Clinical AI', 'Decision support']),
            video: m.cdssVideo,
            poster: m.cdssImg,
          },
          {
            tabLabel: 'AI Baggage Recovery',
            name: 'AI Baggage Recovery',
            head: 'AI-powered lost baggage recovery',
            copy: 'A proof of concept combining AI-generated bag descriptions with visual scan matching, giving agents ranked confidence scores to recover baggage faster',
            chips: chips(['Aviation', 'Computer vision', 'GenAI']),
            video: m.baggageVideo,
            poster: m.baggageImg,
          },
        ],
      },
      industries: {
        heading: 'Where we apply it',
        lede: 'Engineering expertise applied across industries where technology drives growth and operational performance',
        items: [
          'Aviation',
          'Engineering & Manufacturing',
          'Healthcare',
          'Banking & Finance',
          'Insurance',
          'Retail & E-Commerce',
          'Transport & Logistics',
          'Travel',
        ].map((name) => ({ name })),
      },
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      _status: 'published',
      header: {
        navLinks: [
          { label: 'Services', href: '/services' },
          { label: 'Industries', href: '#industries' },
          { label: 'Success stories', href: '#work' },
          { label: 'About', href: '#about' },
        ],
        ctaLabel: 'Talk to us',
        ctaHref: '#contact',
      },
      footer: {
        columns: [
          {
            title: 'Explore',
            links: [
              { label: 'Services', href: '/services' },
              { label: 'Work', href: '#work' },
              { label: 'AI labs', href: '#labs' },
            ],
          },
          {
            title: 'About',
            links: [
              { label: 'Industries', href: '#industries' },
              { label: 'About', href: '#about' },
              { label: 'Contact', href: '#contact' },
            ],
          },
          {
            title: 'Insights',
            links: [
              { label: 'Insights', href: 'https://people10.com/insights/', external: true },
              { label: 'Success stories', href: STORY_URL, external: true },
            ],
          },
        ],
        copyright: '© 2026 People10. All rights reserved.',
        tagline: 'Engineering the Intelligent Enterprise',
      },
    },
  })

  console.log('Seeded homepage content, site settings and media.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
