import { useEffect, useState } from 'react'

type Props = { value: number; run: boolean; prefix?: string; suffix?: string; duration?: number }

/** Counts from 0 to `value` while `run` is true. Jumps straight there with reduced motion. */
export function CountUp({ value, run, prefix = '', suffix = '', duration = 1000 }: Props) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setN(value))
      return () => cancelAnimationFrame(id)
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, value, duration])

  return (
    <span>
      <span className="sr-only">{`${prefix}${value.toLocaleString('en-US')}${suffix}`}</span>
      <span aria-hidden="true">
        {prefix}
        {n.toLocaleString('en-US')}
        {suffix}
      </span>
    </span>
  )
}
