'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RefreshRouteOnSave() {
  const router = useRouter()
  const [origin, setOrigin] = useState<string | null>(null)

  useEffect(() => setOrigin(window.location.origin), [])

  // The admin editor asks the preview to scroll to the section being edited.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'p10-preview-scroll') return
      const target: unknown = e.data.target
      if (typeof target !== 'string') return
      if (target === 'top') return window.scrollTo({ top: 0, behavior: 'smooth' })
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  if (!origin) return null
  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={origin} />
}
