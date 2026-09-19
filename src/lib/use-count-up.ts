import { useEffect, useRef, useState } from 'react'

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/**
 * Animates a number from 0 -> target once the bound element enters the viewport.
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  options?: { duration?: number; decimals?: number },
) {
  const ref = useRef<T | null>(null)
  const [value, setValue] = useState(0)
  const duration = options?.duration ?? 1400
  const decimals = options?.decimals ?? 0

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => setValue(target))
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()

        const tick = (now: number) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          setValue(target * easeOutExpo(progress))
          if (progress < 1) {
            frame = requestAnimationFrame(tick)
          }
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, duration])

  const rounded = Number(value.toFixed(decimals))
  return { ref, value: rounded }
}
