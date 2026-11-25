'use client';
import { useEffect, useRef } from 'react';

export interface VideoModalState {
  open: boolean;
  src: string;
  poster: string;
}

export default function VideoModal({ state, onClose }: { state: VideoModalState; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // the cards behind keep playing on their own; hold them still while the pop-up is open and let the visible ones go on after
    const behind = [...document.querySelectorAll<HTMLVideoElement>('video[data-bg-video]')];
    if (state.open) {
      behind.forEach((v) => v.pause());
      video.play().catch(() => {});
      document.body.style.overflow = 'hidden';
    } else {
      video.pause();
      video.removeAttribute('src'); // let go of the file so nothing keeps playing or buffering behind the closed pop-up
      video.load();
      document.body.style.overflow = '';
      behind.forEach((v) => {
        const r = v.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) v.play().catch(() => {});
      });
    }
  }, [state.open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={['video-modal', state.open ? 'open' : ''].filter(Boolean).join(' ')} role="dialog" aria-modal="true" aria-label="Video player">
      <div className="video-modal-backdrop" onClick={onClose} />
      <div className="video-modal-inner">
        <button className="video-modal-close" onClick={onClose} aria-label="Close video">
          ✕
        </button>
        <video ref={videoRef} controls playsInline src={state.open ? state.src : undefined} poster={state.poster} />
      </div>
    </div>
  );
}
