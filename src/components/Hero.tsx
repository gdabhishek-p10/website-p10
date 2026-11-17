'use client';
import { useEffect, useRef, useState } from 'react';
import type { HomeData } from '@/lib/homepage';

// Only the word "AI" carries the accent colour in the headline, wherever it appears (before, accent or after).
function withAi(text: string) {
  return text.split(/\b(AI)\b/).map((part, i) => (part === 'AI' ? <span key={i} className="hero-ai">{part}</span> : part));
}

export default function Hero({ hero, onAsk }: { hero: HomeData['hero']; onAsk: (q: string) => void }) {
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState('What can we solve for you?');
  const [focused, setFocused] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prompts = ['What can we solve for you?', ...hero.prompts.filter(Boolean)];
    let timer: ReturnType<typeof setTimeout> | undefined;
    let index = 0;
    let count = prompts[0].length;
    let deleting = true;
    const tick = () => {
      if (deleting) {
        count--;
        setPlaceholder(prompts[index].slice(0, Math.max(0, count)));
        if (count <= 0) {
          index = (index + 1) % prompts.length;
          deleting = false;
          timer = setTimeout(tick, 350);
        } else timer = setTimeout(tick, 35);
      } else {
        count++;
        setPlaceholder(prompts[index].slice(0, count));
        if (count >= prompts[index].length) {
          deleting = true;
          timer = setTimeout(tick, 2600);
        } else timer = setTimeout(tick, 65);
      }
    };
    const sync = () => {
      clearTimeout(timer);
      index = 0;
      count = prompts[0].length;
      deleting = true;
      setPlaceholder(prompts[0]);
      if (!preference.matches && !value && !focused) timer = setTimeout(tick, 3000);
    };
    sync();
    preference.addEventListener('change', sync);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener('change', sync);
    };
  }, [hero.prompts, value, focused]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const resize = () => {
      input.style.height = '28px';
      const height = Math.min(input.scrollHeight, window.innerWidth < 600 ? 84 : 56);
      input.style.height = `${Math.max(28, height)}px`;
      setMultiline(height > 35);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [value]);
  // each part of the headline is optional; join whichever are filled in
  const before = hero.before.trim();
  const accent = hero.accent.trim();
  const after = hero.after.trim();

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <h1>
            {withAi(before)}
            {before && accent ? ' ' : ''}
            {withAi(accent)}
            {after && (before || accent) && !/^[.,!?;:]/.test(after) ? ' ' : ''}
            {withAi(after)}
          </h1>
          <p className="lede">{hero.lede}</p>
          <div className="hero-ask">
          <form
            className={`hero-chat-launcher${multiline ? ' is-multiline' : ''}${focused ? ' is-focused' : ''}`}
            role="search"
            aria-label="Ask People10 AI"
            onSubmit={(event) => {
              event.preventDefault();
              if (!value.trim()) return;
              onAsk(value.trim());
              setValue('');
            }}
          >
            <svg className="hero-launcher-spark" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M13 2c1.5 7 4 9.5 11 11-7 1.5-9.5 4-11 11C11.5 17 9 14.5 2 13 9 11.5 11.5 9 13 2Z" />
              <path d="M25 21c.7 3.3 1.7 4.3 5 5-3.3.7-4.3 1.7-5 5-.7-3.3-1.7-4.3-5-5 3.3-.7 4.3-1.7 5-5Z" />
            </svg>
            <div className="hero-launcher-field">
              <textarea
                ref={inputRef}
                rows={1}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                aria-label="What can we solve for you?"
                autoComplete="off"
              />
              {!value && (
                <span className="hero-launcher-placeholder" aria-hidden="true">
                  <span>{placeholder}<i className="hero-launcher-caret" /></span>
                </span>
              )}
            </div>
            <button className="hero-launcher-send" type="submit" aria-label="Send question" disabled={!value.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m21 3-6.5 18-4-7.5L3 9.5 21 3Z" />
                <path d="m10.5 13.5 6-6" />
              </svg>
            </button>
          </form>
          </div>
        </div>
      </div>
    </section>
  );
}
