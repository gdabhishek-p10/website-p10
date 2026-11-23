'use client';
import { useEffect, useState } from 'react';
import LabApproach from './LabApproach';
import LabFlow from './LabFlow';
import LabProtocol from './LabProtocol';
import LabBench from './LabBench';

const LAYOUTS = [
  { id: 'classic', label: 'Classic' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'protocol', label: 'Protocol' },
  { id: 'bench', label: 'Bench' },
] as const;
type Layout = (typeof LAYOUTS)[number]['id'];

const STORAGE_KEY = 'pp-lab-approach-layout';

// The P10 AI Labs section above the footer, with a switch at the top to try different layouts on the same content.
export default function LabApproachSection({ heading, onStart }: { heading: string; onStart: () => void }) {
  const [layout, setLayout] = useState<Layout>('classic');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LAYOUTS.some((l) => l.id === saved)) setLayout(saved as Layout);
    } catch {
      /* no-op */
    }
  }, []);

  function pick(id: Layout) {
    setLayout(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* no-op */
    }
  }

  const props = { heading, onStart };
  return (
    <>
      <div className="lab-sw-wrap">
        <div className="lab-sw" role="tablist" aria-label="P10 AI Labs layout">
          <span className="lab-sw-label">Layout</span>
          {LAYOUTS.map((l) => (
            <button key={l.id} type="button" role="tab" aria-selected={layout === l.id} className={layout === l.id ? 'is-on' : ''} onClick={() => pick(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
      {layout === 'classic' && <LabApproach {...props} />}
      {layout === 'pipeline' && <LabFlow {...props} />}
      {layout === 'protocol' && <LabProtocol {...props} />}
      {layout === 'bench' && <LabBench {...props} />}
    </>
  );
}
