'use client';
import { useEffect, useRef, useState } from 'react';

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

// Plays on its own, muted and looping, while it is on screen. Hover (or tap) shows the controls: play/pause, seek, sound.
// With `autoPlay={false}` it waits for a click and rests on the video's own first frame (no poster image);
// `onPlayingChange` lets the parent follow whether it is playing.
export default function LabVideo({
  src,
  poster,
  label,
  autoPlay = true,
  onPlayingChange,
}: {
  src: string;
  poster: string;
  label: string;
  autoPlay?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState({ now: 0, total: 0 });

  // start when the card is mostly on screen and stop when it leaves, unless the visitor paused it
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current && autoPlay) v.play().catch(() => {});
        else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [autoPlay]);

  function togglePlay() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }

  function toggleMute() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const v = ref.current;
    if (v) v.currentTime = Number(e.target.value);
  }

  return (
    <div className="exp-media">
      <video
        ref={ref}
        src={autoPlay ? src : `${src}#t=0.001`}
        poster={autoPlay ? poster : undefined}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onClick={togglePlay}
        onPlay={() => {
          setPlaying(true);
          onPlayingChange?.(true);
        }}
        onPause={() => {
          setPlaying(false);
          onPlayingChange?.(false);
        }}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onLoadedMetadata={(e) => setTime({ now: 0, total: e.currentTarget.duration })}
        onTimeUpdate={(e) => setTime({ now: e.currentTarget.currentTime, total: e.currentTarget.duration })}
      />
      <div className="exp-controls">
        <button type="button" className="exp-ctl" onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'}>
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          )}
        </button>
        <input
          className="exp-seek"
          type="range"
          min={0}
          max={time.total || 0}
          step={0.1}
          value={time.now}
          onChange={seek}
          aria-label="Seek video"
          style={{ ['--seek' as string]: `${time.total ? (time.now / time.total) * 100 : 0}%` }}
        />
        <span className="exp-time">
          {fmt(time.now)} / {fmt(time.total || 0)}
        </span>
        <button type="button" className="exp-ctl" onClick={toggleMute} aria-label={muted ? 'Unmute video' : 'Mute video'}>
          {muted ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4zM22 9l-6 6M16 9l6 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
