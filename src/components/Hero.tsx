'use client';
import { useEffect, useRef, useState } from 'react';
import type { HomeData } from '@/lib/homepage';

export default function Hero({ hero, onAsk }: { hero: HomeData['hero']; onAsk: (q: string) => void }) {
  const [text, setText] = useState('');
  const [value, setValue] = useState('');
  const [fading, setFading] = useState(false);
  const stateRef = useRef({ prompt: 0, char: 0 });
  const { prompts } = hero;

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
            {hero.before}
            <br />
            <span>{hero.accent}</span> {hero.after}
          </h1>
          <p className="lede">{hero.lede}</p>
          <form
            className="hero-chat"
            onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement | null)?.focus()}
            onSubmit={(e) => {
              e.preventDefault();
              onAsk(value.trim());
              setValue('');
            }}
          >
            <span className="hero-chat-icon">✦</span>
            <span className="hero-chat-field">
              <input
                className="hero-chat-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label="Ask People10 AI"
                autoComplete="off"
              />
              {value === '' && (
                <span className="hero-chat-ghost" aria-hidden="true">
                  <span className={['hero-chat-text', fading ? 'fade' : ''].join(' ').trim()}>{text}</span>
                  <span className="hero-chat-caret" />
                </span>
              )}
            </span>
            <button className="hero-chat-send" type="submit" aria-label="Ask">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12h15M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
