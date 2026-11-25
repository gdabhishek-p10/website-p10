'use client';
import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import CredLogos from './CredLogos';
import PropositionStack from './PropositionStack';
import EngineeringAI from './EngineeringAI';
import LabStack from './LabStack';
import Footer from './Footer';
import VideoModal, { type VideoModalState } from './VideoModal';
import ChatWidget, { type ChatState } from './ChatWidget';
import LabApproach from './LabApproach';
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
      <main>
        <Hero hero={data.hero} />
        <LabStack
          aiLabs={data.aiLabs}
          onPlay={(src, poster) => setModal({ open: true, src, poster })}
          onExplore={() => setChat((c) => ({ open: true, seed: 'Show me more of your AI labs', nonce: c.nonce + 1 }))}
        />
        <PropositionStack pillars={data.pillars} />
        <CredLogos logos={data.logos} />
        <EngineeringAI engineering={data.engineering} />
        <LabApproach heading={data.aiLabs.heading} onStart={() => setChat((c) => ({ open: true, seed: '', nonce: c.nonce + 1 }))} />
      </main>
      <Footer footer={data.footer} />
      {!modal.open && (
        <button
          type="button"
          className={`chat-launcher-floating${chat.open ? ' is-open' : ''}`}
          aria-label={chat.open ? 'Close People10 AI chat' : 'Open People10 AI chat'}
          aria-expanded={chat.open}
          onClick={() => setChat((current) => (current.open ? { ...current, open: false } : { open: true, seed: '', nonce: current.nonce + 1 }))}
        >
          {chat.open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M13 3c1.5 6.8 3.9 9.2 10.7 10.7C16.9 15.2 14.5 17.6 13 24.4c-1.5-6.8-3.9-9.2-10.7-10.7C9.1 12.2 11.5 9.8 13 3Z" />
              <path d="M25 19c.8 3.8 2.2 5.2 6 6-3.8.8-5.2 2.2-6 6-.8-3.8-2.2-5.2-6-6 3.8-.8 5.2-2.2 6-6Z" />
            </svg>
          )}
        </button>
      )}
      <VideoModal state={modal} onClose={() => setModal((m) => ({ ...m, open: false }))} />
      <ChatWidget state={chat} data={data} onClose={() => setChat((c) => ({ ...c, open: false }))} />
      <PalettePicker animated={animated} onAnimatedChange={handleAnimatedChange} />
    </>
  );
}
