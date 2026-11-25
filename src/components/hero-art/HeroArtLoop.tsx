'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import HeroArtFlow from './HeroArtFlow'
import HeroArtBuild from './HeroArtBuild'

/* The hero animation, two scenes one after the other, on a loop. First the flow: data goes in, agents work on it,
   outcomes come out (7.2s). Then the build: those outcomes become a product that ships (9s). Each scene is mounted
   fresh when its turn starts so it always plays from its first frame, and they cross-fade rather than overlap. */

const FADE = 500
const SCENES = [
  { key: 'flow', ms: 7400, Scene: HeroArtFlow },
  { key: 'build', ms: 9000, Scene: HeroArtBuild },
] as const

export default function HeroArtLoop() {
  const [rootRef, inView] = useInView<HTMLDivElement>('0px')
  const [round, setRound] = useState(0) // counts every scene shown, so each one is a new mount
  const [out, setOut] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    const vis = () => setHidden(document.hidden)
    on()
    vis()
    mq.addEventListener('change', on)
    document.addEventListener('visibilitychange', vis)
    return () => {
      mq.removeEventListener('change', on)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [])

  const running = inView && !hidden && !reduced
  const scene = SCENES[round % SCENES.length]

  useEffect(() => {
    if (!running) return
    setOut(false)
    const t1 = setTimeout(() => setOut(true), scene.ms - FADE)
    const t2 = setTimeout(() => setRound((r) => r + 1), scene.ms)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [running, round, scene.ms])

  // Scrolled away or tab hidden: on the way back start over from the flow, the first thing that happens (a new key remounts it)
  const prev = useRef(false)
  useEffect(() => {
    if (running && !prev.current && round > 0) setRound((r) => r - (r % SCENES.length) + SCENES.length)
    prev.current = running
  }, [running, round])

  return (
    <div ref={rootRef} className={`ha-loop${out ? ' is-out' : ''}`}>
      <div className="ha-loop-scene" key={`${scene.key}-${round}`}>
        <scene.Scene />
      </div>
    </div>
  )
}
