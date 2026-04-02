import { useEffect, useState } from 'react'
import { getViewportPreset, type ViewportPreset } from '@/lib/lifeline'

export function useViewportPreset() {
  const [viewportPreset, setViewportPreset] = useState<ViewportPreset>(() =>
    typeof window === 'undefined' ? 'desktop' : getViewportPreset(window.innerWidth),
  )

  useEffect(() => {
    const handleResize = () => {
      setViewportPreset(getViewportPreset(window.innerWidth))
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewportPreset
}
