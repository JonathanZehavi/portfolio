import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Design size of a screen. Screens are drawn at this size and the phone is scaled to fit. */
const SCREEN_W = 320
const SCREEN_H = 560
const BEZEL = 9

type Props = { children: ReactNode; screenBg: string; themeClass: string }

/** A plain phone outline, scaled to fill its box. Purely visual: hidden from assistive tech. */
export function Phone({ children, screenBg, themeClass }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.8)

  useEffect(() => {
    const el = box.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      const s = Math.min((height - 24) / (SCREEN_H + BEZEL * 2), (width - 56) / (SCREEN_W + BEZEL * 2), 1.15)
      setScale(Math.max(0.4, s))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const w = (SCREEN_W + BEZEL * 2) * scale
  const h = (SCREEN_H + BEZEL * 2) * scale

  return (
    <div ref={box} className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div style={{ width: w, height: h }}>
        <div
          className="origin-top-left rounded-[46px] bg-[#0d0d0f] shadow-[0_20px_60px_rgb(0_0_0/0.22),inset_0_0_0_1.5px_rgb(255_255_255/0.08)]"
          style={{ width: SCREEN_W + BEZEL * 2, height: SCREEN_H + BEZEL * 2, padding: BEZEL, transform: `scale(${scale})` }}
        >
          <div
            className={`${themeClass} relative h-full w-full overflow-hidden rounded-[38px]`}
            style={{ background: screenBg, padding: 0, border: 0 }}
          >
            <div className="absolute top-0 right-0 left-0 z-10 flex h-8 items-center justify-between px-7 text-[12px] font-semibold opacity-80">
              <span>9:41</span>
              <span className="flex gap-1">
                <span className="h-2.5 w-4 rounded-[3px] border border-current" />
              </span>
            </div>
            <div className="absolute inset-0 top-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** One state of a screen. Only the layer for the active chapter is shown. */
export function Layer({ on, children, className = '' }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={`story-layer ${className}`} data-on={on}>
      {children}
    </div>
  )
}
