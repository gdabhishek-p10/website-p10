'use client';
import { useEffect, useState } from 'react';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Steps through `count` items on its own every `ms`, and starts the wait again whenever the visitor picks one.
export function useCycle(count: number, ms: number, paused: boolean) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (paused || count < 2 || reducedMotion()) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % count), ms);
    return () => clearTimeout(timer);
  }, [active, paused, count, ms]);
  return [active, setActive] as const;
}

// Types `text` out one character at a time, again from the start whenever the text changes.
export function useTypewriter(text: string, msPerChar = 14) {
  const [shown, setShown] = useState(text.length);
  useEffect(() => {
    if (reducedMotion()) {
      setShown(text.length);
      return;
    }
    setShown(0);
    const timer = setInterval(() => {
      setShown((n) => {
        if (n >= text.length) {
          clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, msPerChar);
    return () => clearInterval(timer);
  }, [text, msPerChar]);
  return text.slice(0, shown);
}
