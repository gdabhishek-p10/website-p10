import type { ReactNode } from 'react';

// One small line icon per service (24 x 24, drawn with currentColor), picked by the service's slug.
const PATHS: Record<string, ReactNode> = {
  'ai-strategy-consulting': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  'agentic-ai-automation': (
    <>
      <rect x="5" y="8" width="14" height="10" rx="3" />
      <path d="M12 8V5.5M9.5 12.5h.01M14.5 12.5h.01M9.5 15.5h5" />
      <circle cx="12" cy="4.5" r="1" />
    </>
  ),
  'enterprise-ai-integration': (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.3 11l7.4-4M8.3 13l7.4 4" />
    </>
  ),
  'generative-ai-solutions': (
    <>
      <path d="M11 3l1.8 4.7L17.5 9.5l-4.7 1.8L11 16l-1.8-4.7L4.5 9.5l4.7-1.8z" />
      <path d="M18.5 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  'ai-machine-learning': (
    <>
      <path d="M4 19V5M4 19h16" />
      <path d="M7.5 15l3.5-4 3 3 5-6" />
      <circle cx="19" cy="8" r="1.3" />
    </>
  ),
  'product-engineering': (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  'quality-engineering': (
    <>
      <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </>
  ),
  iot: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
  'dedicated-teams': (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="9.5" r="2.3" />
      <path d="M16 14.2c2.7-.3 4.5 1.5 4.5 4.3" />
    </>
  ),
  'enterprise-software-development': (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M8 10l-2.5 2L8 14M16 10l2.5 2-2.5 2M13 9.5l-2 5" />
    </>
  ),
  'legacy-application-modernization': (
    <>
      <path d="M20 11a8 8 0 0 0-14.3-4.6L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.3 4.6L20 16" />
      <path d="M20 20v-4h-4" />
    </>
  ),
  'cloud-engineering': <path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5z" />,
  'data-engineering': (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  'system-integrations': (
    <>
      <path d="M9.5 14.5l5-5" />
      <path d="M11 6.5l1-1a4 4 0 0 1 5.6 5.6l-1 1M13 17.5l-1 1a4 4 0 0 1-5.6-5.6l1-1" />
    </>
  ),
  'cloud-infrastructure-managed-services': (
    <>
      <rect x="4" y="4" width="16" height="6" rx="2" />
      <rect x="4" y="14" width="16" height="6" rx="2" />
      <path d="M8 7h.01M8 17h.01M12 7h4M12 17h4" />
    </>
  ),
  'application-support-maintenance': (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M6.3 6.3l3.4 3.4M14.3 14.3l3.4 3.4M17.7 6.3l-3.4 3.4M9.7 14.3l-3.4 3.4" />
    </>
  ),
  'devops-platform-engineering': (
    <path d="M8 8c-2.5 0-4 1.8-4 4s1.5 4 4 4c3 0 5-8 8-8 2.5 0 4 1.8 4 4s-1.5 4-4 4c-3 0-5-8-8-8z" />
  ),
  'mdm-data-governance': (
    <>
      <path d="M12 3l9 4.5-9 4.5L3 7.5z" />
      <path d="M3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" />
    </>
  ),
  'dba-data-ops': (
    <>
      <ellipse cx="11" cy="6" rx="6.5" ry="2.8" />
      <path d="M4.5 6v5c0 1.5 2.9 2.8 6.5 2.8M4.5 11v5c0 1.5 2.9 2.8 6.5 2.8" />
      <circle cx="17.5" cy="16.5" r="3.2" />
      <path d="M16.2 16.5l.9.9 1.7-1.8" />
    </>
  ),
};

const FALLBACK = <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />;

export default function ServiceIcon({ slug }: { slug: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[slug] ?? FALLBACK}
    </svg>
  );
}

// Small sparkle that marks the "AI edge" line on each card.
export function Spark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.1 6.4L20.5 10.5l-6.4 2.1L12 19l-2.1-6.4L3.5 10.5l6.4-2.1z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" opacity=".7" />
    </svg>
  );
}
