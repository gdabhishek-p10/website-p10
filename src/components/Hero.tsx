'use client';
import { useEffect, useRef, useState } from 'react';
import type { HomeData } from '@/lib/homepage';

export default function Hero({ hero }: { hero: HomeData['hero'] }) {
  const [text, setText] = useState('');
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
          <div className="hero-chat">
            <span className="hero-chat-icon">✦</span>
            <span className="hero-chat-field">
              <span className={['hero-chat-text', fading ? 'fade' : ''].join(' ').trim()}>{text}</span>
              <span className="hero-chat-caret" />
            </span>
            <button className="hero-chat-send" type="button" aria-label="Send">
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
          </div>
        </div>
      </div>
    </section>
  );
}
