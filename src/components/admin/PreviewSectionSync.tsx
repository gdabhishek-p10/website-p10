'use client'
import { useLivePreviewContext } from '@payloadcms/ui'
import { useEffect } from 'react'

// Editor tab label -> element to scroll to in the preview page.
const SECTION_BY_TAB: Record<string, string> = {
  Hero: 'top',
  'Client logos': '.cred',
  'Problem framing': '#about',
  Pillars: '#capabilities',
  'Engineering + AI': '#engineering-ai',
  'Case studies': '#work',
  'AI Labs': '#labs',
  Industries: '#industries',
  Header: 'top',
  Footer: 'footer',
}

const ACTIVE_TAB = '.tabs-field__tab-button--active'

export function PreviewSectionSync() {
  const { iframeRef, isLivePreviewing } = useLivePreviewContext()

  useEffect(() => {
    const send = () => {
      const label = document.querySelector(ACTIVE_TAB)?.textContent?.trim() ?? ''
      const key = Object.keys(SECTION_BY_TAB).find((k) => label.startsWith(k))
      if (!key) return
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'p10-preview-scroll', target: SECTION_BY_TAB[key] },
        window.location.origin,
      )
    }

    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.tabs-field__tab-button')) setTimeout(send, 0)
    }
    document.addEventListener('click', onClick, true)

    // When the preview opens or reloads, jump to the tab that is currently open.
    const timers = isLivePreviewing ? [800, 1800, 3500].map((ms) => setTimeout(send, ms)) : []
    const iframe = iframeRef.current
    const onLoad = () => setTimeout(send, 400)
    iframe?.addEventListener('load', onLoad)

    return () => {
      document.removeEventListener('click', onClick, true)
      timers.forEach(clearTimeout)
      iframe?.removeEventListener('load', onLoad)
    }
  }, [iframeRef, isLivePreviewing])

  return null
}

export default PreviewSectionSync
