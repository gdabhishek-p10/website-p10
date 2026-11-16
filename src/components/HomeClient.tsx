'use client';
import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import CredLogos from './CredLogos';
import Reality from './Reality';
import PropositionStack from './PropositionStack';
import EngineeringAI from './EngineeringAI';
import CaseStudies from './CaseStudies';
import AILabs from './AILabs';
import Industries from './Industries';
import Footer from './Footer';
import VideoModal, { type VideoModalState } from './VideoModal';
import ChatWidget, { type ChatState } from './ChatWidget';
import PalettePicker from './PalettePicker';
import type { HomeData } from '@/lib/homepage';

function getInitialAnimated(): boolean {
  try {
    return localStorage.getItem('pp-stack-anim') === 'on';
  } catch {
    return false;
  }
}

export default function HomeClient({ data }: { data: HomeData }) {
  const [animated, setAnimated] = useState(getInitialAnimated);
  const [modal, setModal] = useState<VideoModalState>({ open: false, src: '', poster: '' });

  const [chat, setChat] = useState<ChatState>({ open: false, seed: '', nonce: 0 });

  function handleAnimatedChange(v: boolean) {
    setAnimated(v);
    try {
      localStorage.setItem('pp-stack-anim', v ? 'on' : 'off');
    } catch {
      /* no-op */
    }
  }

  return (
    <>
      <Header header={data.header} />
      <main id="main">
        <Hero hero={data.hero} onAsk={(q) => setChat((c) => ({ open: true, seed: q, nonce: c.nonce + 1 }))} />
        <CredLogos logos={data.logos} />
        <Reality problem={data.problem} />
        <PropositionStack pillars={data.pillars} />
        <CaseStudies caseStudies={data.caseStudies} onPlay={(src, poster) => setModal({ open: true, src, poster })} />
        <EngineeringAI engineering={data.engineering} />
        <AILabs aiLabs={data.aiLabs} onPlay={(src, poster) => setModal({ open: true, src, poster })} />
        <Industries industries={data.industries} />
      </main>
      <Footer footer={data.footer} />
      {!chat.open && !modal.open && (
        <button
          type="button"
          className="chat-launcher-floating"
          aria-label="Open People10 AI chat"
          aria-haspopup="dialog"
          onClick={() => setChat((current) => ({ open: true, seed: '', nonce: current.nonce + 1 }))}
        >
          <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path d="M13 3c1.5 6.8 3.9 9.2 10.7 10.7C16.9 15.2 14.5 17.6 13 24.4c-1.5-6.8-3.9-9.2-10.7-10.7C9.1 12.2 11.5 9.8 13 3Z" />
            <path d="M25 19c.8 3.8 2.2 5.2 6 6-3.8.8-5.2 2.2-6 6-.8-3.8-2.2-5.2-6-6 3.8-.8 5.2-2.2 6-6Z" />
          </svg>
        </button>
      )}
      <VideoModal state={modal} onClose={() => setModal((m) => ({ ...m, open: false }))} />
      <ChatWidget state={chat} data={data} onClose={() => setChat((c) => ({ ...c, open: false }))} />
      <PalettePicker animated={animated} onAnimatedChange={handleAnimatedChange} />
    </>
  );
}
