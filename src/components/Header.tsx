'use client';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import type { HomeData } from '@/lib/homepage';

export default function Header({ header }: { header: HomeData['header'] }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (!menuOpen) {
        if (y > lastScrollY.current && y > 120) setHidden(true);
        else if (y < lastScrollY.current) setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  return (
    <header className={[scrolled ? 'scrolled' : '', hidden ? 'header-hidden' : ''].join(' ').trim()}>
      <div className="container nav">
        <a href="#" aria-label="People10 home">
          <Logo className="logo" />
        </a>
        <nav className={['navlinks', menuOpen ? 'open' : ''].join(' ').trim()}>
          {header.navLinks.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              {l.label}
            </a>
          ))}
          <a href={header.ctaHref} className="navlinks-cta" onClick={() => setMenuOpen(false)}>
            {header.ctaLabel} ↗
          </a>
        </nav>
        <a className="btn" href={header.ctaHref}>
          {header.ctaLabel} <span className="arrow">↗</span>
        </a>
        <button className="menu" aria-label="Open menu" onClick={() => setMenuOpen((v) => !v)}>
          ☰
        </button>
      </div>
    </header>
  );
}
