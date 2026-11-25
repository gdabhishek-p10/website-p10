'use client';
import { useEffect, useState } from 'react';
import LabApproach from './LabApproach';
import LabBench from './LabBench';
import LabStage from './LabStage';

const LAYOUTS = [
  { id: 'bench', label: 'Bench' },
  { id: 'classic', label: 'Classic' },
  { id: 'stage', label: 'Stage' },
  { id: 'stage2', label: 'Stage v2' },
] as const;
type Layout = (typeof LAYOUTS)[number]['id'];

const STORAGE_KEY = 'pp-lab-approach-layout';

// The P10 AI Labs section above the footer, with a switch at the top to try different layouts on the same content.
export default function LabApproachSection({ heading, onStart }: { heading: string; onStart: () => void }) {
  const [layout, setLayout] = useState<Layout>(LAYOUTS[0].id);

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
      {layout === 'bench' && <LabBench {...props} />}
      {layout === 'stage' && <LabStage {...props} />}
      {layout === 'stage2' && <LabStage {...props} variant="line" />}
    </>
  );
}
