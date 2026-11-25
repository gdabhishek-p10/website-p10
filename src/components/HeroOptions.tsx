'use client';
import { useEffect, useState } from 'react';
import type { HomeData } from '@/lib/homepage';
import Hero from './Hero';
import LabStack from './LabStack';
import LabsBento from './LabsBento';
import { HERO_ARTS } from './hero-art';

const OPTIONS = [
  { id: 'one', label: 'Option 1' },
  { id: 'two', label: 'Option 2' },
] as const;
type Option = (typeof OPTIONS)[number]['id'];

const STORAGE_KEY = 'pp-hero-option';
const ART_KEY = 'pp-hero-art';
type ArtId = (typeof HERO_ARTS)[number]['id'];

// The hero and what follows it, with a switch to try the two versions:
// 1. the headline, then the AI lab cards that stack as you scroll (the v7 hero: banner cards, text left, video right)
// 2. a hero with the headline big on the left and an animation on the right (pick one of a few), then the AI lab videos
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
  const [artId, setArtId] = useState<ArtId>(HERO_ARTS[0].id);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (OPTIONS.some((o) => o.id === saved)) setOption(saved as Option);
      const savedArt = localStorage.getItem(ART_KEY);
      if (HERO_ARTS.some((a) => a.id === savedArt)) setArtId(savedArt as ArtId);
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

  function pickArt(id: ArtId) {
    setArtId(id);
    try {
      localStorage.setItem(ART_KEY, id);
    } catch {
      /* no-op */
    }
  }

  const Art = HERO_ARTS.find((a) => a.id === artId)?.Component ?? HERO_ARTS[0].Component;

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
        {option === 'two' && (
          <div className="lab-sw" role="tablist" aria-label="Hero animation">
            <span className="lab-sw-label">Animation</span>
            {HERO_ARTS.map((a) => (
              <button key={a.id} type="button" role="tab" aria-selected={artId === a.id} className={artId === a.id ? 'is-on' : ''} onClick={() => pickArt(a.id)}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <Hero hero={data.hero} solo={option === 'two'} art={option === 'two' ? <Art key={artId} /> : undefined} />
      {option === 'one' ? <LabStack aiLabs={data.aiLabs} onPlay={onPlay} onExplore={onExplore} /> : <LabsBento aiLabs={data.aiLabs} onExplore={onExplore} />}
    </>
  );
}
