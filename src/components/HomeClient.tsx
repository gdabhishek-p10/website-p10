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
      <main>
        <Hero hero={data.hero} onAsk={(q) => setChat((c) => ({ open: true, seed: q, nonce: c.nonce + 1 }))} />
        <CredLogos logos={data.logos} />
        <Reality problem={data.problem} />
        <PropositionStack pillars={data.pillars} animated={animated} />
        <CaseStudies caseStudies={data.caseStudies} onPlay={(src, poster) => setModal({ open: true, src, poster })} />
        <EngineeringAI engineering={data.engineering} />
        <AILabs aiLabs={data.aiLabs} onPlay={(src, poster) => setModal({ open: true, src, poster })} />
        <Industries industries={data.industries} />
      </main>
      <Footer footer={data.footer} />
      <VideoModal state={modal} onClose={() => setModal((m) => ({ ...m, open: false }))} />
      <ChatWidget state={chat} data={data} onClose={() => setChat((c) => ({ ...c, open: false }))} />
      <PalettePicker animated={animated} onAnimatedChange={handleAnimatedChange} />
    </>
  );
}
