import { useEffect, useRef, useState } from 'react'
import {
  TOOLTIP_FADE_MS,
  TOOLTIP_HIDE_DELAY_MS,
  type HoveredTooltip,
  type ScenePoint,
} from '@/lib/lifeline'

export function useSceneTooltip() {
  const hideTooltipTimeoutRef = useRef<number | null>(null)
  const isTooltipHoveredRef = useRef(false)
  const [hoveredTooltip, setHoveredTooltip] = useState<HoveredTooltip | null>(null)

  useEffect(() => {
    if (!hoveredTooltip || hoveredTooltip.visible) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setHoveredTooltip((current) => (current && !current.visible ? null : current))
    }, TOOLTIP_FADE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [hoveredTooltip])

  useEffect(() => {
    return () => {
      document.body.style.cursor = ''
      isTooltipHoveredRef.current = false

      if (hideTooltipTimeoutRef.current != null) {
        window.clearTimeout(hideTooltipTimeoutRef.current)
      }
    }
  }, [])

  const clearTooltipHideTimeout = () => {
    if (hideTooltipTimeoutRef.current != null) {
      window.clearTimeout(hideTooltipTimeoutRef.current)
      hideTooltipTimeoutRef.current = null
    }
  }

  const scheduleTooltipHide = () => {
    clearTooltipHideTimeout()
    hideTooltipTimeoutRef.current = window.setTimeout(() => {
      if (isTooltipHoveredRef.current) {
        hideTooltipTimeoutRef.current = null
        return
      }

      setHoveredTooltip((current) => (current ? { ...current, visible: false } : current))
      hideTooltipTimeoutRef.current = null
      document.body.style.cursor = ''
    }, TOOLTIP_HIDE_DELAY_MS)
  }

  const handlePointHover = (point: ScenePoint) => {
    clearTooltipHideTimeout()
    isTooltipHoveredRef.current = false
    setHoveredTooltip({
      point,
      visible: true,
    })
  }

  const handleTooltipMouseEnter = () => {
    isTooltipHoveredRef.current = true
    clearTooltipHideTimeout()
    setHoveredTooltip((current) => (current ? { ...current, visible: true } : current))
  }

  const handleTooltipMouseLeave = () => {
    isTooltipHoveredRef.current = false
    scheduleTooltipHide()
  }

  return {
    hoveredTooltip,
    handlePointHover,
    handleTooltipMouseEnter,
    handleTooltipMouseLeave,
    scheduleTooltipHide,
  }
}
