// The services platter, tidied: each service has a plain description and, where there is one, a short "AI edge".
// This is the starting content for the Services page CMS section, and the fallback if that section is still empty.
// Group titles and one-liners are taken from the live homepage so the two stay consistent.

export interface ServiceItem {
  name: string
  slug: string // used in the link to this service, e.g. /services#cloud-engineering
  description: string
  aiEdge?: string
}

export interface ServiceGroup {
  key: string
  tag: string
  title: string
  tagline: string
  services: ServiceItem[]
}

export interface ServicesData {
  tag: string
  heading: string
  lede: string
  groups: ServiceGroup[]
  closingHeading: string
  closingText: string
}

export const SERVICES_DEFAULTS: ServicesData = {
  tag: 'Services',
  heading: 'Services that put AI to work',
  lede: 'From strategy to managed operations, one team to build, modernize and run what your business depends on',
  groups: [
    {
      key: 'ai',
      tag: 'AI services',
      title: 'Scale AI across the business',
      tagline: 'Faster decisions, less routine work, returns measured in revenue, not pilots',
      services: [
        {
          name: 'AI strategy & consulting',
          slug: 'ai-strategy-consulting',
          description: 'Advice on where and how AI creates value: roadmap, use-case selection and ROI.',
          aiEdge: 'Sets the AI agenda before any build',
        },
        {
          name: 'Agentic AI & automation',
          slug: 'agentic-ai-automation',
          description: 'Customizable autonomous agents that execute multi-step business workflows.',
        },
        {
          name: 'Enterprise AI integration',
          slug: 'enterprise-ai-integration',
          description: 'Embed LLMs and AI safely into your existing enterprise systems and data.',
        },
        {
          name: 'Generative AI solutions',
          slug: 'generative-ai-solutions',
          description: 'Copilots, content and knowledge assistants built on your enterprise data.',
        },
        {
          name: 'AI & machine learning',
          slug: 'ai-machine-learning',
          description: 'Predictive models, ML productionization, MLOps, forecasting and optimization.',
        },
      ],
    },
    {
      key: 'build',
      tag: 'Build',
      title: 'Build products and platforms with AI',
      tagline: 'From idea to market in weeks, not quarters',
      services: [
        {
          name: 'Product engineering',
          slug: 'product-engineering',
          description: 'Web, mobile and MVP product development, with user-centric design.',
          aiEdge: 'Efficient product development leveraging AI tools',
        },
        {
          name: 'Quality engineering',
          slug: 'quality-engineering',
          description: 'Test automation, functional, performance and security testing.',
          aiEdge: 'Agentic QA: AI agents for faster, safer releases',
        },
        {
          name: 'IoT',
          slug: 'iot',
          description: 'Connected devices, real-time telemetry and edge computing.',
          aiEdge: 'Edge data feeding predictive AI and automation',
        },
        {
          name: 'Dedicated teams',
          slug: 'dedicated-teams',
          description: 'Dedicated engineering teams that extend yours, ramp up quickly and stay accountable to outcomes.',
          aiEdge: 'AI-augmented squads that ship faster from day one',
        },
      ],
    },
    {
      key: 'modernize',
      tag: 'Modernize',
      title: 'Modernize what holds the business back',
      tagline: 'Lower running costs and systems ready for AI, without starting over',
      services: [
        {
          name: 'Enterprise software development',
          slug: 'enterprise-software-development',
          description: 'Custom enterprise applications and business-critical systems.',
          aiEdge: 'AI-assisted engineering',
        },
        {
          name: 'Legacy application modernization',
          slug: 'legacy-application-modernization',
          description:
            'Re-platform and refactor legacy applications with minimal disruption, creating AI-ready, cloud-native systems.',
          aiEdge: 'AI-assisted legacy modernization',
        },
        {
          name: 'Cloud engineering',
          slug: 'cloud-engineering',
          description: 'Cloud strategy, cloud-native build, migration and optimization.',
        },
        {
          name: 'Data engineering',
          slug: 'data-engineering',
          description: 'Scalable pipelines and modern data architecture.',
          aiEdge: 'Feeds the AI-ready data layer: real-time and governed',
        },
        {
          name: 'System integrations',
          slug: 'system-integrations',
          description: 'Connect enterprise systems, APIs and third-party platforms.',
        },
      ],
    },
    {
      key: 'run',
      tag: 'Run & optimize',
      title: 'Run and improve what you’ve built, with AI on watch',
      tagline: 'Reliable operations that get smarter every month',
      services: [
        {
          name: 'Cloud & infrastructure managed services',
          slug: 'cloud-infrastructure-managed-services',
          description: 'Run, monitor and optimize cloud and infrastructure, with SRE and AIOps.',
          aiEdge: 'AIOps: predictive, self-healing operations',
        },
        {
          name: 'Application support & maintenance',
          slug: 'application-support-maintenance',
          description: 'Keep business-critical applications healthy and evolving.',
          aiEdge: 'AI-assisted triage and incident summarization',
        },
        {
          name: 'DevOps & platform engineering',
          slug: 'devops-platform-engineering',
          description: 'CI/CD, infrastructure as code, containers and internal developer platforms.',
          aiEdge: 'AI-augmented delivery pipelines and platform operations',
        },
        {
          name: 'Master data management (MDM) & data governance',
          slug: 'mdm-data-governance',
          description: 'A single source of truth, with data quality and governance.',
          aiEdge: 'Governed, trustworthy data: the trust layer for AI',
        },
        {
          name: 'Database administration (DBA) & data ops',
          slug: 'dba-data-ops',
          description: 'Managed databases, tuning and availability of your systems of record.',
          aiEdge: 'Autonomous DBA, with anomaly detection on the core',
        },
      ],
    },
  ],
  closingHeading: 'Not sure where to start?',
  closingText: 'Tell us what you’re trying to change, and we’ll point you to the right place to begin',
}
