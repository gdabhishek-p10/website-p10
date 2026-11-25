'use client';
import { useEffect, useRef, useState } from 'react';

// True while the element is on (or just beside) the screen; layouts use it to pause their loops when scrolled away.
export function useInView<T extends HTMLElement>(margin = '120px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: `${margin} 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}
