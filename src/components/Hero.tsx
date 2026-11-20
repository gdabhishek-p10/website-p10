'use client';
import { useEffect, useRef, useState } from 'react';
import type { HomeData } from '@/lib/homepage';

// Only the word "AI" carries the accent colour in the headline, wherever it appears (before, accent or after).
function withAi(text: string) {
  return text.split(/\b(AI)\b/).map((part, i) => (part === 'AI' ? <span key={i} className="hero-ai">{part}</span> : part));
}

export default function Hero({ hero, onAsk }: { hero: HomeData['hero']; onAsk: (q: string) => void }) {
  const [text, setText] = useState('');
  const [value, setValue] = useState('');
  const [fading, setFading] = useState(false);
  const stateRef = useRef({ prompt: 0, char: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const { prompts } = hero;
  // each part of the headline is optional; join whichever are filled in
  const before = hero.before.trim();
  const accent = hero.accent.trim();
  const after = hero.after.trim();

  useEffect(() => {
    if (prompts.length === 0) return;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const s = stateRef.current;
      if (s.char <= prompts[s.prompt].length) {
        setText(prompts[s.prompt].slice(0, s.char));
        s.char++;
        timer = setTimeout(type, 45);
      } else {
        timer = setTimeout(erase, 1800);
      }
    };
    const erase = () => {
      setFading(true);
      timer = setTimeout(() => {
        setText('');
        setFading(false);
        const s = stateRef.current;
        s.char = 0;
        s.prompt = (s.prompt + 1) % prompts.length;
        timer = setTimeout(type, 300);
      }, 350);
    };
    type();
    return () => clearTimeout(timer);
  }, [prompts]);

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
          <form
            className="hero-ask"
            onSubmit={(e) => {
              e.preventDefault();
              if (!value.trim()) return;
              onAsk(value.trim());
              setValue('');
            }}
          >
            <div className="hero-ask-box" onClick={() => inputRef.current?.focus()}>
              <span className="hero-ask-icon" aria-hidden="true">✦</span>
              <input
                ref={inputRef}
                className="hero-ask-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label="Ask People10 AI"
                autoComplete="off"
              />
              {value === '' && (
                <span className="hero-chat-ghost hero-ask-ghost" aria-hidden="true">
                  <span className={['hero-chat-text', fading ? 'fade' : ''].join(' ').trim()}>{text}</span>
                  <span className="hero-chat-caret" />
                </span>
              )}
              <button className="hero-ask-send" type="submit" aria-label="Ask" disabled={!value.trim()}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            {prompts.length > 0 && (
              <div className="hero-ask-chips" role="group" aria-label="Suggested questions">
                {prompts.map((q) => {
                  const fill = q.replace(/…$/, '');
                  return (
                    <button
                      key={q}
                      type="button"
                      title={fill}
                      className={`hero-ask-chip${value === fill ? ' is-picked' : ''}`}
                      aria-pressed={value === fill}
                      onClick={() => {
                        setValue(fill);
                        inputRef.current?.focus();
                      }}
                    >
                      {fill}
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
