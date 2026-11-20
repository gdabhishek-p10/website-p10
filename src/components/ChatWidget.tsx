'use client';
import { useEffect, useRef, useState } from 'react';
import type { HomeData } from '@/lib/homepage';

export interface ChatState {
  open: boolean;
  seed: string;
  nonce: number;
}

interface Message {
  role: 'user' | 'bot';
  text: string;
  cta?: { label: string; href: string };
}

const SUGGESTIONS = ['What do you do?', 'Show me AI case studies', 'Which industries do you serve?'];

const FALLBACK: Message = {
  role: 'bot',
  text: "I can only help with People10's services, industries and case studies. For anything else, our team will be glad to talk",
  cta: { label: 'Talk to us', href: '#contact' },
};

// Answers are grounded only in the homepage content passed in
function reply(q: string, data: HomeData): Message {
  const t = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));

  if (has('case', 'success', 'result', 'example', 'work')) {
    const items = data.caseStudies.items;
    if (items.length === 0) return FALLBACK;
    return { role: 'bot', text: `Here is some of our work:\n${items.map((c) => `• ${c.title} (${c.tag})`).join('\n')}`, cta: { label: 'See case studies', href: '#work' } };
  }
  if (has('industr', 'sector', 'aviation', 'health', 'bank', 'insur', 'retail', 'logistic', 'travel', 'manufactur')) {
    return { role: 'bot', text: `We apply engineering and AI across ${data.industries.items.join(', ')}`, cta: { label: 'Explore industries', href: '#industries' } };
  }
  if (has('lab', 'poc', 'proof', 'experiment', 'demo')) {
    const names = data.aiLabs.entries.map((e) => e.name).join(', ');
    return { role: 'bot', text: `${data.aiLabs.lede}${names ? `. Current experiments: ${names}` : ''}`, cta: { label: 'Visit AI Labs', href: '#labs' } };
  }
  const pillar = data.pillars.items.find((p) =>
    has(...p.chips.map((c) => c.toLowerCase().split(' ')[0]), p.key === 'ai' ? 'ai' : p.key === 'build' ? 'build' : 'moderni', p.key === 'modernize' ? 'legacy' : p.key === 'build' ? 'product' : 'agent'),
  );
  if (pillar) {
    return { role: 'bot', text: `${pillar.title}: ${pillar.body}.\nCapabilities: ${pillar.chips.join(', ')}`, cta: { label: 'Explore services', href: '#capabilities' } };
  }
  if (has('what', 'service', 'offer', 'help', 'do you', 'capabilit')) {
    return {
      role: 'bot',
      text: `${data.pillars.lede}\n${data.pillars.items.map((p) => `• ${p.title}`).join('\n')}`,
      cta: { label: 'Explore services', href: '#capabilities' },
    };
  }
  return FALLBACK;
}

export default function ChatWidget({ state, data, onClose }: { state: ChatState; data: HomeData; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dataRef = useRef(data);
  dataRef.current = data;

  function ask(q: string) {
    const text = q.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, reply(text, dataRef.current)]);
      setTyping(false);
    }, 600);
  }

  // A new question from the hero input arrives as a new nonce
  useEffect(() => {
    if (!state.open) return;
    if (state.seed) {
      setMessages((m) => [...m, { role: 'user', text: state.seed }]);
      setTyping(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setMessages((m) => [...m, reply(state.seed, dataRef.current)]);
        setTyping(false);
      }, 600);
    }
    inputRef.current?.focus();
    return () => clearTimeout(timer.current);
  }, [state.open, state.seed, state.nonce]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, typing]);

  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (maximized) setMaximized(false);
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.open, maximized, onClose]);

  // the docked window leaves the page usable; only the maximized chat locks the page behind it
  useEffect(() => {
    document.body.style.overflow = state.open && maximized ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.open, maximized]);

  if (!state.open) return null;

  return (
    <div className={['chat', maximized ? 'chat-max' : ''].filter(Boolean).join(' ')}>
      {maximized && <div className="chat-backdrop" onClick={() => setMaximized(false)} />}
      <div className="chat-panel" role="dialog" aria-modal={maximized} aria-label="People10 AI assistant">
        <div className="chat-head">
          <span className="chat-head-icon">✦</span>
          <div className="chat-head-title">
            <b>People10 AI</b>
            <small>Ask about our services, industries and work</small>
          </div>
          <button type="button" className="chat-btn" onClick={() => setMaximized((v) => !v)} aria-label={maximized ? 'Restore chat size' : 'Maximize chat'}>
            {maximized ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 4v5H4M15 20v-5h5M4 9l6-6M20 15l-6 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
              </svg>
            )}
          </button>
          <button type="button" className="chat-btn" onClick={onClose} aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="chat-body" aria-live="polite">
          <div className="chat-msg chat-bot">
            <p>Hi, I'm the People10 AI assistant. Ask me about what we do, who we work with, and what we have delivered</p>
          </div>
          {messages.length === 0 && (
            <div className="chat-suggest">
              {SUGGESTIONS.map((s) => (
                <button type="button" key={s} onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg chat-${m.role}`}>
              <p>{m.text}</p>
              {m.cta && (
                <a className="chat-cta" href={m.cta.href} onClick={() => setMaximized(false)}>
                  {m.cta.label} →
                </a>
              )}
            </div>
          ))}
          {typing && (
            <div className="chat-msg chat-bot chat-typing" aria-label="Assistant is typing">
              <i />
              <i />
              <i />
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question…" aria-label="Your message" />
          <button type="submit" className="chat-send" aria-label="Send" disabled={!input.trim()}>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
