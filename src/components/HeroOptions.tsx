'use client';
import { useEffect, useState } from 'react';
import type { HomeData } from '@/lib/homepage';
import Hero from './Hero';
import LabStack from './LabStack';
import LabsBento from './LabsBento';
import { HeroArtLoop } from './hero-art';

const OPTIONS = [
  { id: 'one', label: 'Option 1' },
  { id: 'two', label: 'Option 2' },
] as const;
type Option = (typeof OPTIONS)[number]['id'];

const STORAGE_KEY = 'pp-hero-option';

// The hero and what follows it, with a switch to try the two versions:
// 1. the headline, then the AI lab cards that stack as you scroll (the v7 hero: banner cards, text left, video right)
// 2. a hero with the headline big on the left and an animation on the right (the flow, then the build, on a loop), then the AI lab videos
//    as a bento of cards
export default function HeroOptions({
  data,
  onPlay,
  onExplore,
}: {
  data: HomeData;
  onPlay: (video: string, poster: string) => void;
  onExplore: () => void;
}) {
  const [option, setOption] = useState<Option>('one');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (OPTIONS.some((o) => o.id === saved)) setOption(saved as Option);
    } catch {
      /* no-op */
    }
  }, []);

  function pick(id: Option) {
    setOption(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* no-op */
    }
  }

  return (
    <>
      <div className="lab-sw-wrap hero-sw">
        <div className="lab-sw" role="tablist" aria-label="Hero version">
          <span className="lab-sw-label">Hero</span>
          {OPTIONS.map((o) => (
            <button key={o.id} type="button" role="tab" aria-selected={option === o.id} className={option === o.id ? 'is-on' : ''} onClick={() => pick(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <Hero hero={data.hero} solo={option === 'two'} art={option === 'two' ? <HeroArtLoop /> : undefined} />
      {option === 'one' ? <LabStack aiLabs={data.aiLabs} onPlay={onPlay} onExplore={onExplore} /> : <LabsBento aiLabs={data.aiLabs} onPlay={onPlay} onExplore={onExplore} />}
    </>
  );
}
