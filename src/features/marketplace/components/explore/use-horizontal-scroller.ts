import { useCallback, useEffect, useRef, useState } from 'react'

export function useHorizontalScroller() {
  const ref = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      setCanPrev(scrollLeft > 4)
      setCanNext(scrollLeft + clientWidth < scrollWidth - 4)
    }

    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    const inner = el.firstElementChild
    if (inner) ro.observe(inner)

    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = ref.current
    if (!el) return
    const step = Math.min(Math.round(el.clientWidth * 0.72), 420)
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }, [])

  return {
    ref,
    canPrev,
    canNext,
    scrollPrev: () => scrollByDir(-1),
    scrollNext: () => scrollByDir(1),
  }
}
