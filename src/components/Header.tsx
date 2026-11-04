'use client';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';
import type { HomeData } from '@/lib/homepage';

const isServices = (href: string) => href === '/services' || href === '/services/';
// the Industries menu item points at the section on the home page: "#industries", or "/#industries" from other pages
const isIndustries = (href: string) => /(^|\/)#industries$/.test(href);
const isAbout = (href: string) => /(^|\/)#about$/.test(href);

type DropKey = 'services' | 'industries' | 'about';

export default function Header({ header, homeHref = '#' }: { header: HomeData['header']; homeHref?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<DropKey | null>(null); // which dropdown is showing
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menu = header.servicesMenu;
  const industries = header.industriesMenu;
  const about = header.aboutMenu;

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

  // close a dropdown on Escape or a click outside the menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  const openDrop = (key: DropKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const closeDropSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };
  const closeAll = () => {
    setOpen(null);
    setMenuOpen(false);
  };

  // the label link, the little arrow that toggles the panel, and the shared hover behaviour
  const dropHead = (key: DropKey, label: string, href: string) => (
    <div className="nav-drop-head">
      <a href={href} onClick={closeAll}>
        {label}
      </a>
      <button
        type="button"
        className="nav-drop-toggle"
        aria-label={`${open === key ? 'Hide' : 'Show'} ${label.toLowerCase()} menu`}
        aria-expanded={open === key}
        onClick={() => setOpen((v) => (v === key ? null : key))}
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>
    </div>
  );

  return (
    <header className={[scrolled ? 'scrolled' : '', hidden ? 'header-hidden' : ''].join(' ').trim()}>
      <div className="container nav">
        <a href={homeHref} aria-label="People10 home">
          <Logo className="logo" />
        </a>
        <nav ref={navRef} className={['navlinks', menuOpen ? 'open' : ''].join(' ').trim()}>
          {header.navLinks.map((l) => {
            if (isServices(l.href) && menu.groups.length > 0) {
              return (
                <div
                  key={l.href + l.label}
                  className={`nav-drop${open === 'services' ? ' is-open' : ''}`}
                  onMouseEnter={() => openDrop('services')}
                  onMouseLeave={closeDropSoon}
                >
                  {dropHead('services', l.label, l.href)}
                  <div className="nav-panel" role="menu">
                    <a className="nav-panel-title" href={l.href} onClick={closeAll}>
                      {l.label} <span aria-hidden="true">→</span>
                    </a>
                    <div className="nav-panel-grid">
                      {menu.groups.map((g) => (
                        <div key={g.key} className="nav-col">
                          <a className="nav-col-title" href={`${l.href}#group-${g.key}`} onClick={closeAll}>
                            {g.tag}
                          </a>
                          <ul>
                            {g.services.map((s) => (
                              <li key={s.slug}>
                                <a href={`${l.href}#${s.slug}`} role="menuitem" onClick={closeAll}>
                                  {s.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            if (isIndustries(l.href) && industries.length > 0) {
              const base = l.href.replace(/#industries$/, ''); // "" on the home page, "/" elsewhere
              return (
                <div
                  key={l.href + l.label}
                  className={`nav-drop nav-drop-sm${open === 'industries' ? ' is-open' : ''}`}
                  onMouseEnter={() => openDrop('industries')}
                  onMouseLeave={closeDropSoon}
                >
                  {dropHead('industries', l.label, l.href)}
                  <div className="nav-panel" role="menu">
                    <a className="nav-panel-title" href={l.href} onClick={closeAll}>
                      {l.label} <span aria-hidden="true">→</span>
                    </a>
                    <ul className="nav-list">
                      {industries.map((i) => (
                        <li key={i.slug}>
                          <a href={`${base}#industry-${i.slug}`} role="menuitem" onClick={closeAll}>
                            {i.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }
            if (isAbout(l.href) && about.length > 0) {
              return (
                <div
                  key={l.href + l.label}
                  className={`nav-drop nav-drop-sm nav-drop-narrow${open === 'about' ? ' is-open' : ''}`}
                  onMouseEnter={() => openDrop('about')}
                  onMouseLeave={closeDropSoon}
                >
                  {dropHead('about', l.label, l.href)}
                  <div className="nav-panel" role="menu">
                    <ul className="nav-list">
                      {about.map((a) => (
                        <li key={a.href + a.label}>
                          <a
                            href={a.href}
                            role="menuitem"
                            onClick={closeAll}
                            {...(a.external ? { target: '_blank', rel: 'noopener' } : {})}
                          >
                            {a.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }
            return (
              <a
                key={l.href + l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
              >
                {l.label}
              </a>
            );
          })}
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
