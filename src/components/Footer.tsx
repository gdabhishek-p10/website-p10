import Logo from './Logo';
import Reveal from './Reveal';
import type { HomeData } from '@/lib/homepage';

export default function Footer({ footer }: { footer: HomeData['footer'] }) {
  return (
    <footer id="insights">
      <div className="container">
        <Reveal className="footer-grid" stagger>
          <div>
            <Logo className="footer-logo" />
          </div>
          {footer.columns.map((col) => (
            <div className="footer-col" key={col.title}>
              <strong>{col.title}</strong>
              {col.links.map((l) => (
                <a key={l.label} href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </Reveal>
        <div className="footer-bottom">
          <span>{footer.copyright}</span>
          {footer.tagline && <span>{footer.tagline}</span>}
        </div>
      </div>
    </footer>
  );
}
