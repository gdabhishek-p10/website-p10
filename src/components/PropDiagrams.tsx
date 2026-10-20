export function FlowDiagram() {
  return (
    <div
      className="flow-diagram"
      role="img"
      aria-label="Legacy systems are modernized through re-architecture and cloud migration into a system that is ready to scale"
    >
      <div className="diagram-card dc-dark">
        <div className="diagram-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="7" rx="2" />
            <rect x="3" y="13" width="18" height="7" rx="2" />
            <circle cx="7" cy="7.5" r=".6" fill="currentColor" stroke="none" />
            <circle cx="7" cy="16.5" r=".6" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <h4>Legacy systems</h4>
        <ul>
          <li>Monoliths</li>
          <li>Siloed data</li>
          <li>Aging infrastructure</li>
        </ul>
      </div>
      <div className="flow-arrow">→</div>
      <div className="diagram-card dc-n2">
        <div className="diagram-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18a5 5 0 0 1-.7-9.96A6 6 0 0 1 18 10.1 4.5 4.5 0 0 1 17.5 18H7Z" />
          </svg>
        </div>
        <h4>Modernize</h4>
        <ul>
          <li>Re-architect</li>
          <li>Migrate to cloud</li>
          <li>Integrate data</li>
          <li>Keep operations running</li>
        </ul>
      </div>
      <div className="flow-arrow">→</div>
      <div className="diagram-card dc-ochre">
        <div className="diagram-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="14" width="4" height="7" rx="1.5" />
            <rect x="10" y="9" width="4" height="12" rx="1.5" />
            <rect x="17" y="4" width="4" height="17" rx="1.5" />
          </svg>
        </div>
        <h4>Ready to scale</h4>
        <ul>
          <li>Connected systems</li>
          <li>Automated workflows</li>
          <li>Lower costs</li>
          <li>Built for what's next</li>
        </ul>
      </div>
    </div>
  );
}

export function QuadDiagram() {
  return (
    <div className="quad-diagram" role="img" aria-label="Design, build, test and scale stages surrounding a product interface">
      <div className="quad-side">
        <span className="conn-piece conn-elbow" style={{ top: '25%', right: 16, width: 16, height: '25%', borderTop: '2px solid #b0b5ba', borderRight: '2px solid #b0b5ba', borderTopRightRadius: 14 }} />
        <span className="conn-piece conn-elbow" style={{ top: '50%', right: 16, width: 16, height: '25%', borderBottom: '2px solid #b0b5ba', borderRight: '2px solid #b0b5ba', borderBottomRightRadius: 14 }} />
        <span className="conn-piece conn-line" style={{ top: 'calc(50% - 1px)', right: 0, width: 16, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '25%', right: 32, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '75%', right: 32, background: '#b0b5ba' }} />
        <div className="quad-col">
          <div className="diagram-card dc-n1">
            <div className="diagram-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6 4 12l5 6" />
                <path d="M15 6l5 6-5 6" />
              </svg>
            </div>
            <h4>Design</h4>
            <p>Turn ideas into scalable architecture</p>
          </div>
          <div className="diagram-card dc-n2">
            <div className="diagram-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h4>Test</h4>
            <p>Ensure quality and reliability</p>
          </div>
        </div>
      </div>
      <div className="quad-mock">
        <div className="quad-mock-header">
          <span style={{ background: '#ef4444' }} />
          <span style={{ background: '#f5b942' }} />
          <span style={{ background: '#22c55e' }} />
        </div>
        <div className="quad-mock-body">
          <div className="quad-mock-nav">
            <div className="quad-mock-bar" style={{ width: '100%', height: 8 }} />
            <div className="quad-mock-bar" style={{ width: '80%' }} />
            <div className="quad-mock-bar" style={{ width: '80%' }} />
            <div className="quad-mock-bar" style={{ width: '80%' }} />
            <div className="quad-mock-bar" style={{ width: '80%' }} />
          </div>
          <div className="quad-mock-content">
            <div className="quad-mock-bar" style={{ width: '90%' }} />
            <div className="quad-mock-bar" style={{ width: '100%' }} />
            <div className="quad-mock-bar" style={{ width: '70%' }} />
            <div className="quad-mock-btn" />
          </div>
          <div className="quad-mock-chart">
            <svg viewBox="0 0 40 24" preserveAspectRatio="none">
              <polyline points="0,18 8,14 16,20 24,8 32,10 40,2" fill="none" stroke="#4b5560" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="quad-side">
        <span className="conn-piece conn-elbow" style={{ top: '25%', left: 16, width: 16, height: '25%', borderTop: '2px solid #b0b5ba', borderLeft: '2px solid #b0b5ba', borderTopLeftRadius: 14 }} />
        <span className="conn-piece conn-elbow" style={{ top: '50%', left: 16, width: 16, height: '25%', borderBottom: '2px solid #b0b5ba', borderLeft: '2px solid #b0b5ba', borderBottomLeftRadius: 14 }} />
        <span className="conn-piece conn-line" style={{ top: 'calc(50% - 1px)', left: 0, width: 16, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '25%', left: 32, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '75%', left: 32, background: '#b0b5ba' }} />
        <div className="quad-col">
          <div className="diagram-card dc-n1">
            <div className="diagram-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm9.3 2.6-.3 1.2c-.1.2-.3.3-.5.4l-.9.2a6.6 6.6 0 0 1-.6 1.4l.5.9c.1.2.1.4 0 .6l-.8.8c-.2.1-.4.1-.6 0l-.9-.5c-.4.3-.9.5-1.4.6l-.2.9c0 .2-.2.4-.4.5l-1.2.3c-.2 0-.4 0-.6-.1l-.7-.7a6.6 6.6 0 0 1-1.5 0l-.7.7c-.2.1-.4.1-.6.1l-1.2-.3c-.2-.1-.3-.3-.4-.5l-.2-.9a6.6 6.6 0 0 1-1.4-.6l-.9.5c-.2.1-.4.1-.6 0l-.8-.8c-.1-.2-.1-.4 0-.6l.5-.9a6.6 6.6 0 0 1-.6-1.4l-.9-.2c-.2-.1-.4-.2-.5-.4l-.3-1.2c0-.2 0-.4.1-.6l.7-.7a6.6 6.6 0 0 1 0-1.5l-.7-.7c-.1-.2-.1-.4-.1-.6l.3-1.2c.1-.2.3-.3.5-.4l.9-.2c.1-.5.3-1 .6-1.4l-.5-.9c-.1-.2-.1-.4 0-.6l.8-.8c.2-.1.4-.1.6 0l.9.5c.4-.3.9-.5 1.4-.6l.2-.9c.1-.2.2-.4.4-.5l1.2-.3c.2 0 .4 0 .6.1l.7.7a6.6 6.6 0 0 1 1.5 0l.7-.7c.2-.1.4-.1.6-.1l1.2.3c.2.1.3.3.4.5l.2.9c.5.1 1 .3 1.4.6l.9-.5c.2-.1.4-.1.6 0l.8.8c.1.2.1.4 0 .6l-.5.9c.3.4.5.9.6 1.4l.9.2c.2.1.4.2.5.4l.3 1.2c0 .2 0 .4-.1.6l-.7.7a6.6 6.6 0 0 1 0 1.5l.7.7c.1.2.1.4.1.6Z" />
              </svg>
            </div>
            <h4>Build</h4>
            <p>Develop with agile teams</p>
          </div>
          <div className="diagram-card dc-n2">
            <div className="diagram-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c2.2 1.8 3.5 4.6 3.5 8v3.5l-3.5 2-3.5-2V10c0-3.4 1.3-6.2 3.5-8Z" />
                <circle cx="12" cy="9" r="1.4" fill="#fff" />
                <path d="M8.5 13l-2.5 1v3l2.5-1.5Z" />
                <path d="M15.5 13l2.5 1v3l-2.5-1.5Z" />
                <path d="M10.3 17.5h3.4l-1.7 3.3-1.7-3.3Z" />
              </svg>
            </div>
            <h4>Scale</h4>
            <p>Take products to market faster</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HubDiagram() {
  return (
    <div
      className="hub-diagram"
      role="img"
      aria-label="Your data and systems feed AI, which automates work and creates measurable value"
    >
      <div className="hub-side">
        <span className="conn-piece conn-elbow" style={{ top: '25%', right: 16, width: 16, height: '25%', borderTop: '2px solid #b0b5ba', borderRight: '2px solid #b0b5ba', borderTopRightRadius: 14 }} />
        <span className="conn-piece conn-elbow" style={{ top: '50%', right: 16, width: 16, height: '25%', borderBottom: '2px solid #b0b5ba', borderRight: '2px solid #b0b5ba', borderBottomRightRadius: 14 }} />
        <span className="conn-piece conn-line" style={{ top: 'calc(50% - 1px)', right: 16, width: 16, background: '#b0b5ba' }} />
        <span className="conn-piece conn-line" style={{ top: 'calc(50% - 1px)', right: 0, width: 16, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '25%', right: 32, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '75%', right: 32, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '50%', right: 16, width: 5, height: 5, background: '#b0b5ba' }} />
        <div className="hub-col">
          <div className="diagram-card dc-n1">
            <div className="diagram-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                <path d="M14 3v4h4" />
                <path d="M8.5 12h7M8.5 15.5h7M8.5 8.5h3" />
              </svg>
            </div>
            <h4>Your data</h4>
            <p>Turn data into insights</p>
          </div>
          <div className="diagram-card dc-n2">
            <div className="diagram-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm9.3 2.6-.3 1.2c-.1.2-.3.3-.5.4l-.9.2a6.6 6.6 0 0 1-.6 1.4l.5.9c.1.2.1.4 0 .6l-.8.8c-.2.1-.4.1-.6 0l-.9-.5c-.4.3-.9.5-1.4.6l-.2.9c0 .2-.2.4-.4.5l-1.2.3c-.2 0-.4 0-.6-.1l-.7-.7a6.6 6.6 0 0 1-1.5 0l-.7.7c-.2.1-.4.1-.6.1l-1.2-.3c-.2-.1-.3-.3-.4-.5l-.2-.9a6.6 6.6 0 0 1-1.4-.6l-.9.5c-.2.1-.4.1-.6 0l-.8-.8c-.1-.2-.1-.4 0-.6l.5-.9a6.6 6.6 0 0 1-.6-1.4l-.9-.2c-.2-.1-.4-.2-.5-.4l-.3-1.2c0-.2 0-.4.1-.6l.7-.7a6.6 6.6 0 0 1 0-1.5l-.7-.7c-.1-.2-.1-.4-.1-.6l.3-1.2c.1-.2.3-.3.5-.4l.9-.2c.1-.5.3-1 .6-1.4l-.5-.9c-.1-.2-.1-.4 0-.6l.8-.8c.2-.1.4-.1.6 0l.9.5c.4-.3.9-.5 1.4-.6l.2-.9c.1-.2.2-.4.4-.5l1.2-.3c.2 0 .4 0 .6.1l.7.7a6.6 6.6 0 0 1 1.5 0l.7-.7c.2-.1.4-.1.6-.1l1.2.3c.2.1.3.3.4.5l.2.9c.5.1 1 .3 1.4.6l.9-.5c.2-.1.4-.1.6 0l.8.8c.1.2.1.4 0 .6l-.5.9c.3.4.5.9.6 1.4l.9.2c.2.1.4.2.5.4l.3 1.2c0 .2 0 .4-.1.6l-.7.7a6.6 6.6 0 0 1 0 1.5l.7.7c.1.2.1.4.1.6Z" />
              </svg>
            </div>
            <h4>Your systems</h4>
            <p>Work with what you already run</p>
          </div>
        </div>
      </div>
      <div className="hub-center">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />
          <path d="M18 12l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
          <path d="M6 14l.5 1.5L8 16l-1.5.5L6 18l-.5-1.5L4 16l1.5-.5L6 14Z" />
        </svg>
        <span>AI</span>
        <small>Models · Agents · Automation</small>
      </div>
      <div className="hub-side">
        <span className="conn-piece conn-elbow" style={{ top: '25%', left: 16, width: 16, height: '25%', borderTop: '2px solid #b0b5ba', borderLeft: '2px solid #b0b5ba', borderTopLeftRadius: 14 }} />
        <span className="conn-piece conn-elbow" style={{ top: '50%', left: 16, width: 16, height: '25%', borderBottom: '2px solid #b0b5ba', borderLeft: '2px solid #b0b5ba', borderBottomLeftRadius: 14 }} />
        <span className="conn-piece conn-line" style={{ top: 'calc(50% - 1px)', left: 16, width: 16, background: '#b0b5ba' }} />
        <span className="conn-piece conn-line" style={{ top: 'calc(50% - 1px)', left: 0, width: 16, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '25%', left: 32, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '50%', left: 16, width: 5, height: 5, background: '#b0b5ba' }} />
        <span className="conn-dot" style={{ top: '75%', left: 32, background: '#b0b5ba' }} />
        <div className="hub-col">
          <div className="diagram-card dc-n2">
            <div className="diagram-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="14" width="4" height="7" rx="1.5" />
                <rect x="10" y="9" width="4" height="12" rx="1.5" />
                <rect x="17" y="4" width="4" height="17" rx="1.5" />
              </svg>
            </div>
            <h4>Automate</h4>
            <p>Reduce manual work</p>
          </div>
          <div className="diagram-card dc-n2">
            <div className="diagram-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="13" r="7.5" />
                <circle cx="11" cy="13" r="3.8" />
                <circle cx="11" cy="13" r=".7" fill="currentColor" stroke="none" />
                <path d="M15.5 8.5 20 4M20 4h-3.2M20 4v3.2" />
              </svg>
            </div>
            <h4>Create value</h4>
            <p>Measurable business outcomes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
