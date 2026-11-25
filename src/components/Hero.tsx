'use client';
import type { ReactNode } from 'react';
import type { HomeData } from '@/lib/homepage';

// Only the word "AI" carries the accent colour in the headline, wherever it appears (before, accent or after).
function withAi(text: string) {
  return text.split(/\b(AI)\b/).map((part, i) => (part === 'AI' ? <span key={i} className="hero-ai">{part}</span> : part));
}

// `solo` makes the headline the whole section: big, on the left, with `art` (an animation) filling the right
export default function Hero({ hero, solo = false, art }: { hero: HomeData['hero']; solo?: boolean; art?: ReactNode }) {
  // each part of the headline is optional; join whichever are filled in
  const before = hero.before.trim();
  const accent = hero.accent.trim();
  const after = hero.after.trim();

  return (
    <section className={solo ? 'hero hero-solo' : 'hero'}>
      <div className="container hero-grid">
        <div>
          <h1>
            {withAi(before)}
            {before && accent ? ' ' : ''}
            {withAi(accent)}
            {after && (before || accent) && !/^[.,!?;:]/.test(after) ? ' ' : ''}
            {withAi(after)}
          </h1>
        </div>
        {solo && art && (
          <div className="hero-art" aria-hidden="true">
            {art}
          </div>
        )}
      </div>
    </section>
  );
}

