import type { ReactNode } from 'react';

export type Kind = 'erp' | 'crm' | 'docs' | 'approvals' | 'sheet' | 'data' | 'cloud' | 'analytics' | 'portal' | 'agent';

const sk = (w: string, tone = '') => <span className={`et-sk ${tone}`} style={{ width: w }} />;

function Row({ id, w, tag }: { id: string; w: string; tag?: string }) {
  return (
    <div className="et-row">
      <span className="et-id">{id}</span>
      {sk(w)}
      {tag && <span className="et-tag">{tag}</span>}
    </div>
  );
}

const HEAD_COLOR: Record<Kind, string> = {
  erp: '#5b7a91',
  crm: '#0a8fbd',
  docs: '#7b8791',
  approvals: '#b8860b',
  sheet: '#5f9b7a',
  data: '#5b7a91',
  cloud: '#0a8fbd',
  analytics: '#7b8791',
  portal: '#0a8fbd',
  agent: '#b8860b',
};

const LABEL: Record<Kind, string> = {
  erp: 'ERP',
  crm: 'CRM',
  docs: 'Documents',
  approvals: 'Approvals',
  sheet: 'Spreadsheet',
  data: 'Data warehouse',
  cloud: 'Cloud',
  analytics: 'Analytics',
  portal: 'Customer Portal',
  agent: 'AI Agent',
};

const BODY: Record<Kind, ReactNode> = {
  erp: (
    <>
      <Row id="PO-2041" w="34%" tag="Open" />
      <Row id="PO-2042" w="46%" tag="Paid" />
      <Row id="PO-2043" w="28%" tag="Open" />
    </>
  ),
  crm: (
    <>
      <div className="et-row">
        <span className="et-avatar" />
        <div className="et-stack">
          {sk('62%', 'd')}
          {sk('40%')}
        </div>
      </div>
      <div className="et-row">
        <span className="et-tag">Lead</span>
        <span className="et-tag">Proposal</span>
        <span className="et-tag on">Won</span>
      </div>
      <div className="et-row">{sk('78%')}</div>
      <div className="et-row">{sk('52%')}</div>
    </>
  ),
  docs: (
    <>
      <div className="et-row">{sk('58%', 'd')}</div>
      <div className="et-row">{sk('94%')}</div>
      <div className="et-row">{sk('88%')}</div>
      <div className="et-row">{sk('92%')}</div>
      <div className="et-row">{sk('46%')}</div>
    </>
  ),
  approvals: (
    <>
      <div className="et-row">
        <svg className="et-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 7 8 6 8-6" />
        </svg>
        <div className="et-stack">
          {sk('70%', 'd')}
          {sk('44%')}
        </div>
        <span className="et-badge">3</span>
      </div>
      <div className="et-row">{sk('86%')}</div>
      <div className="et-row">
        <span className="et-btn">Approve</span>
        <span className="et-btn ghost">Review</span>
      </div>
    </>
  ),
  sheet: (
    <div className="et-grid">
      {Array.from({ length: 20 }, (_, i) => (
        <span key={i} className={i < 4 ? 'h' : i === 9 ? 'hl' : ''} />
      ))}
    </div>
  ),
  data: (
    <>
      <div className="et-row">
        <svg className="et-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
        <div className="et-stack">{sk('58%', 'd')}</div>
      </div>
      <Row id="orders" w="30%" tag="2.4M" />
      <Row id="stock" w="42%" tag="880K" />
      <Row id="ledger" w="24%" tag="5.1M" />
    </>
  ),
  cloud: (
    <>
      <div className="et-row">
        <svg className="et-icon lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
          <path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.6 4.7 4.7 0 0 1 17.5 18Z" />
        </svg>
        <div className="et-stack">
          {sk('64%', 'd')}
          {sk('38%')}
        </div>
      </div>
      <div className="et-meter"><i style={{ width: '72%' }} /></div>
      <div className="et-meter"><i style={{ width: '46%' }} /></div>
      <div className="et-meter"><i style={{ width: '58%' }} /></div>
    </>
  ),
  analytics: (
    <>
      <div className="et-bars">
        {[38, 54, 46, 66, 58, 82, 72].map((h, i, a) => (
          <i key={i} className={i === a.length - 1 ? 'hl' : ''} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="et-row" style={{ marginTop: 7 }}>
        {sk('30%', 'd')}
        {sk('18%')}
      </div>
    </>
  ),
  portal: (
    <>
      <div className="et-row">
        {sk('46%', 'd')}
        <span className="et-tag on">New</span>
      </div>
      <div className="et-row">{sk('88%')}</div>
      <div className="et-row">{sk('62%')}</div>
      <div className="et-row">
        <span className="et-btn">Launch</span>
      </div>
    </>
  ),
  agent: (
    <>
      <div className="et-row">
        <svg className="et-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H12l-3.5 3.5V16H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />
        </svg>
        <div className="et-stack">
          {sk('66%', 'd')}
          {sk('40%')}
        </div>
      </div>
      <div className="et-row">{sk('80%')}</div>
      <div className="et-row">
        <span className="et-tag on">Always-on</span>
      </div>
    </>
  ),
};

export function CardShell({ kind, children }: { kind: Kind; children?: ReactNode }) {
  return (
    <>
      <div className="et-head">
        <i style={{ background: HEAD_COLOR[kind] }} />
        {LABEL[kind]}
      </div>
      {BODY[kind]}
      {children}
    </>
  );
}

export const PILLS: { label: string; ai?: boolean }[] = [
  { label: 'Modernize' },
  { label: 'Automate', ai: true },
  { label: 'Innovate', ai: true },
  { label: 'Scale' },
];

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.2 6.3L20.5 10l-6.3 1.7L12 18l-2.2-6.3L3.5 10l6.3-1.7L12 2Z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
    </svg>
  );
}
