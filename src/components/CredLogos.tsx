import Image from 'next/image';
import type { Img } from '@/lib/homepage';

export default function CredLogos({ logos }: { logos: Img[] }) {
  const doubled = [...logos, ...logos];
  return (
    <section className="cred" aria-label="Selected clients">
      <div className="container">
        <div className="cred-inner">
          <div className="client-logo-grid">
            <div className="client-logo-track">
              {doubled.map((logo, i) => (
                <div className="client-logo" key={`${logo.url}-${i}`}>
                  <Image src={logo.url} alt={logo.alt} width={logo.width || 160} height={logo.height || 48} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
