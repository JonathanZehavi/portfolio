import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import type { AppInfo } from '../data/apps'
import { Phone } from './story/Phone'
import { Screen as MasloolScreen } from '../apps/maslool/Story'
import { Screen as TelemScreen } from '../apps/telem/Story'
import { Screen as MixedWorldScreen } from '../apps/mixed-world/Story'
import { Screen as KaloScreen } from '../apps/kalo/Story'

type Reel = { Screen: ComponentType<{ active: number }>; screenBg: string; themeClass: string; steps: number[] }

/** Which story screens each app plays in the hero, in order. */
const REELS: Record<string, Reel> = {
  maslool: { Screen: MasloolScreen, screenBg: 'var(--paper)', themeClass: 'maslool', steps: [0, 1, 2, 3] },
  telem: { Screen: TelemScreen, screenBg: 'var(--page)', themeClass: 'telem', steps: [1, 2, 3] },
  'mixed-world': { Screen: MixedWorldScreen, screenBg: 'var(--canvas)', themeClass: 'mixed', steps: [0, 1, 2] },
  kalo: { Screen: KaloScreen, screenBg: 'var(--bg)', themeClass: 'kalo', steps: [1, 2, 3] },
}
const STEP_MS = 2800

type Props = { apps: AppInfo[]; onOpen: (app: AppInfo, trigger: HTMLElement) => void }

/**
 * The hero's phone: plays each app's story screens in turn.
 * Stops while hovered, focused, off screen, in a background tab, while an app window is open,
 * after the pause button, and never advances on its own with reduced motion.
 */
export default function Showcase({ apps, onOpen }: Props) {
  const list = useMemo(() => apps.filter((a) => REELS[a.id]), [apps])
  const [pos, setPos] = useState({ app: 0, step: 0 })
  const { app: appIdx, step } = pos
  const [paused, setPaused] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [hold, setHold] = useState(false)
  const [visible, setVisible] = useState(true)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || hold || !visible) return
    const id = window.setInterval(() => {
      if (document.hidden || document.querySelector('dialog[open]')) return
      setPos(({ app, step }) =>
        step + 1 < REELS[list[app].id].steps.length ? { app, step: step + 1 } : { app: (app + 1) % list.length, step: 0 },
      )
    }, STEP_MS)
    return () => window.clearInterval(id)
  }, [paused, hold, visible, list])

  const choose = (i: number) => setPos({ app: i, step: 0 })

  const current = list[appIdx]

  return (
    <div
      ref={root}
      className="flex flex-col items-center"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <button
        type="button"
        onClick={(e) => onOpen(current, e.currentTarget)}
        aria-label={`Open ${current.name}: ${current.headline}`}
        className="group relative block h-[min(560px,64dvh)] w-full cursor-pointer border-0 bg-transparent p-0"
      >
        {list.map((a, i) => {
          const reel = REELS[a.id]
          const on = i === appIdx
          return (
            <div
              key={a.id}
              className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.015] motion-reduce:transition-opacity"
              style={{ opacity: on ? 1 : 0 }}
            >
              <Phone screenBg={reel.screenBg} themeClass={reel.themeClass}>
                <reel.Screen active={on ? reel.steps[Math.min(step, reel.steps.length - 1)] : -1} />
              </Phone>
            </div>
          )
        })}
      </button>

      {/* Which app is playing, and the controls */}
      <div className="mt-4 flex w-full max-w-[360px] items-center gap-3">
        <div role="tablist" aria-label="App on the phone" className="flex flex-1 justify-center gap-2.5">
          {list.map((a, i) => {
            const on = i === appIdx
            return (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={a.name}
                onClick={() => choose(i)}
                className="relative cursor-pointer rounded-[12px] border-0 bg-transparent p-0"
              >
                <span
                  className={`block size-10 overflow-hidden rounded-[22.5%] transition-[transform,opacity] duration-300 ${on ? 'scale-110 opacity-100' : 'opacity-45 hover:opacity-80'}`}
                  style={{ background: a.color }}
                >
                  <a.Icon />
                </span>
                {/* Progress through this app's screens */}
                <span className="absolute right-1 -bottom-2 left-1 h-[3px] overflow-hidden rounded-full bg-line">
                  <span
                    className="block h-full bg-text transition-[width] duration-500"
                    style={{ width: on ? `${((step + 1) / REELS[a.id].steps.length) * 100}%` : '0%' }}
                  />
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play the app preview' : 'Pause the app preview'}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-text-2 hover:text-text"
        >
          {paused ? (
            <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
              <path d="M3 1.5v9l7-4.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
              <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
      <p className="mt-4 mb-0 text-center text-[14px] text-text-2" aria-live="polite">
        <span className="font-semibold text-text">{current.name}</span> · {current.headline}
      </p>
    </div>
  )
}
