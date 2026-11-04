'use client';
import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import ServiceIcon, { Spark } from './ServiceIcons';
import type { ServicesData } from '@/lib/servicesDefaults';

export default function ServicesView({ data, ctaLabel, ctaHref }: { data: ServicesData; ctaLabel: string; ctaHref: string }) {
  const [active, setActive] = useState(data.groups[0]?.key);
  const [low, setLow] = useState(true); // true while the site header is showing, so the switcher sits just under it

  // highlight the tab of the section being read
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace('group-', ''))),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    data.groups.forEach((g) => {
      const el = document.getElementById(`group-${g.key}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [data.groups]);

  // follow the header: it hides when scrolling down and returns when scrolling up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > last && y > 120) setLow(false);
      else if (y < last) setLow(true);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const words = data.heading.trim().split(' ');
  const last = words.pop();

  return (
    <>
      <section className="svc-hero">
        <div className="container">
          <Reveal>
            <h1>
              {words.join(' ')} <span className="svc-accent">{last}</span>
            </h1>
            {data.lede && <p className="lede">{data.lede}</p>}
          </Reveal>
        </div>
      </section>

      <nav className={`svc-switch${low ? ' is-low' : ''}`} aria-label="Service groups">
        <div className="svc-pills">
          {data.groups.map((g) => (
            <a key={g.key} href={`#group-${g.key}`} className={`svc-pill${active === g.key ? ' is-active' : ''}`}>
              {g.tag}
              <span>{g.services.length}</span>
            </a>
          ))}
        </div>
      </nav>

      {data.groups.map((g) => (
        <section key={g.key} id={`group-${g.key}`} className="svc-group">
          <div className="container">
            <Reveal className="svc-head">
              <h2>{g.title}</h2>
              {g.tagline && <p className="lede">{g.tagline}</p>}
            </Reveal>
            <Reveal className={`svc-grid${g.services.length === 4 ? ' svc-grid-four' : ''}`} stagger>
              {g.services.map((s) => (
                <article key={s.slug} id={s.slug} className="svc-card">
                  <span className="svc-icon">
                    <ServiceIcon slug={s.slug} />
                  </span>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  {s.aiEdge && (
                    <p className="svc-edge">
                      <Spark />
                      <span>{s.aiEdge}</span>
                    </p>
                  )}
                </article>
              ))}
            </Reveal>
          </div>
        </section>
      ))}

      <section className="svc-close">
        <div className="container">
          <Reveal className="svc-close-box">
            <h2>{data.closingHeading}</h2>
            {data.closingText && <p className="lede">{data.closingText}</p>}
            <a className="btn" href={ctaHref}>
              {ctaLabel} <span className="arrow">↗</span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
