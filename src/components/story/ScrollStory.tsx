import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { CountUp } from './CountUp'
import { Phone } from './Phone'

export type Chapter = {
  title: string
  body: ReactNode
  stat?: { value: number; label: string; prefix?: string; suffix?: string }
}

type Props = {
  chapters: Chapter[]
  /** One screen for the whole story; it switches layers by the active chapter. */
  Screen: ComponentType<{ active: number }>
  /** Background of the phone's screen (the app's own page colour). */
  screenBg: string
  /** Class that brings in the app's colour tokens (e.g. "maslool"). */
  themeClass: string
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * A pinned phone and a column of chapters. Whichever chapter crosses the
 * reading line becomes active, and the phone's screen follows it.
 * On phones the phone pins at the top and the chapters scroll under it.
 */
export function ScrollStory({ chapters, Screen, screenBg, themeClass }: Props) {
  const [active, setActive] = useState(0)
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const rootRef = useRef<HTMLDivElement>(null)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const root = rootRef.current?.closest<HTMLElement>('.app-sheet__scroll') ?? null
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        }
      },
      // A thin reading line across the middle of the window.
      { root, rootMargin: wide ? '-48% 0px -50% 0px' : '-40% 0px -40% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [chapters.length, wide])

  const goTo = (i: number) =>
    refs.current[i]?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' })

  if (!wide) {
    // Phones: no pinned stage (it would hide the text). Each chapter is its text, then its own screen,
    // which plays when the chapter reaches the middle of the window.
    return (
      <div ref={rootRef}>
        <ol className="m-0 list-none p-0">
          {chapters.map((c, i) => (
            <li
              key={c.title}
              ref={(el) => {
                refs.current[i] = el
              }}
              data-index={i}
              className="py-10"
            >
              <ChapterText chapter={c} index={i} run={active === i} />
              <div className="relative mt-6 h-[min(64dvh,560px)] rounded-[28px] bg-well">
                <Phone screenBg={screenBg} themeClass={themeClass}>
                  <Screen active={active >= i ? i : -1} />
                </Phone>
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10">
      {/* Pinned stage */}
      <div className="sticky top-6 self-start">
        <div className="relative flex h-[min(680px,calc(100dvh-200px))] items-center justify-center rounded-[28px] bg-well">
          <Phone screenBg={screenBg} themeClass={themeClass}>
            <Screen active={active} />
          </Phone>
          {/* Progress */}
          <ol className="absolute top-1/2 right-3 m-0 flex -translate-y-1/2 list-none flex-col gap-2 p-0" aria-label="Chapters">
            {chapters.map((c, i) => (
              <li key={c.title}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Chapter ${i + 1}: ${c.title}`}
                  aria-current={active === i ? 'step' : undefined}
                  className="block cursor-pointer border-0 bg-transparent p-1.5"
                >
                  <span
                    className={`block w-1.5 rounded-full transition-all duration-300 ${active === i ? 'h-5 bg-text' : 'h-1.5 bg-line'}`}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Chapters */}
      <ol className="m-0 list-none p-0">
        {chapters.map((c, i) => (
          <li
            key={c.title}
            ref={(el) => {
              refs.current[i] = el
            }}
            data-index={i}
            data-active={active === i}
            className="story-chapter flex min-h-[min(680px,calc(100dvh-200px))] flex-col justify-center"
          >
            <ChapterText chapter={c} index={i} run={active === i} />
          </li>
        ))}
      </ol>
    </div>
  )
}

function ChapterText({ chapter: c, index: i, run }: { chapter: Chapter; index: number; run: boolean }) {
  return (
    <>
      <p className="m-0 text-[13px] font-semibold text-text-2 tabular-nums">{String(i + 1).padStart(2, '0')}</p>
      <h3 className="mt-2 mb-0 text-[26px] leading-[1.12] font-semibold tracking-[-0.02em] sm:text-[32px]">{c.title}</h3>
      <div className="mt-3 max-w-[40ch] text-[17px] leading-[1.5] text-text-2">{c.body}</div>
      {c.stat && (
        <p className="mt-5 mb-0">
          <span className="block text-[40px] leading-none font-semibold tracking-[-0.03em] tabular-nums sm:text-[48px]">
            <CountUp run={run} value={c.stat.value} prefix={c.stat.prefix} suffix={c.stat.suffix} />
          </span>
          <span className="mt-1 block text-[14px] text-text-2">{c.stat.label}</span>
        </p>
      )}
    </>
  )
}
