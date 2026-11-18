import { useEffect, useRef, useState } from 'react'
import './demo.css'

const GOAL = 10_000

/** What the Shortcut sends at each of its automations (12:00, 18:00, 21:30 in the app's setup guide). */
const SYNCS = [
  { time: '12:00', activeKcal: 260, steps: 4_310, exerciseMinutes: 12 },
  { time: '18:00', activeKcal: 540, steps: 8_200, exerciseMinutes: 35 },
  { time: '21:30', activeKcal: 655, steps: 10_480, exerciseMinutes: 41 },
]
const EARLIER = [7_820, 11_240, 6_150, 9_480, 12_030, 8_760]

type Phase = 'idle' | 'sending' | 'done'

const todayIso = () => new Date().toISOString().slice(0, 10)
const dayLabel = (offset: number) =>
  new Date(Date.now() + offset * 86_400_000).toLocaleString('en-US', { weekday: 'short' }).slice(0, 2)

export default function KaloDemo() {
  const [step, setStep] = useState(-1) // index of the last sync that landed
  const [phase, setPhase] = useState<Phase>('idle')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const next = Math.min(step + 1, SYNCS.length - 1)
  const pending = SYNCS[next]
  const current = step >= 0 ? SYNCS[step] : { activeKcal: 0, steps: 0, exerciseMinutes: 0, time: '' }
  const allDone = step === SYNCS.length - 1 && phase === 'done'

  const sync = () => {
    if (phase === 'sending') return
    if (allDone) {
      setStep(-1)
      setPhase('idle')
      return
    }
    setPhase('sending')
    timer.current = window.setTimeout(() => {
      setStep(next)
      setPhase('done')
    }, 900)
  }

  const shownPayload = phase === 'idle' ? null : SYNCS[phase === 'sending' ? next : step]
  const body = shownPayload && {
    activeKcal: shownPayload.activeKcal,
    steps: shownPayload.steps,
    exerciseMinutes: shownPayload.exerciseMinutes,
    date: todayIso(),
  }

  // Week chart
  const week = [...EARLIER, current.steps]
  const max = 13_000
  const BW = 26
  const GAP = 14
  const CH = 110
  const r = 34
  const c = 2 * Math.PI * r
  const frac = Math.min(1, current.steps / GOAL)

  return (
    <div className="kalo overflow-hidden rounded-2xl border border-[var(--line)] p-3 sm:p-4">
      <div className="grid gap-3 md:grid-cols-2">
        {/* Today */}
        <section className="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] p-4" aria-label="Today">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 80 80" className="size-20 shrink-0" aria-hidden="true">
              <circle cx="40" cy="40" r={r} fill="none" stroke="var(--line)" strokeWidth="7" />
              <circle
                className="kalo-ring"
                cx="40"
                cy="40"
                r={r}
                fill="none"
                stroke={frac >= 1 ? 'var(--good)' : 'var(--accent)'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${c * frac} ${c}`}
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="min-w-0" aria-live="polite">
              <p className="m-0 text-[13px] text-[var(--ink-2)]">Steps today</p>
              <p className="m-0 text-[28px] leading-tight font-bold tabular-nums">{current.steps.toLocaleString('en-US')}</p>
              <p className="m-0 text-[12px] text-[var(--ink-2)]">
                of {GOAL.toLocaleString('en-US')}
                {current.time && ` · synced ${current.time}`}
              </p>
            </div>
          </div>
          <dl className="m-0 mt-4 grid grid-cols-2 gap-3 border-t border-[var(--line)] pt-3">
            <div>
              <dt className="text-[12px] text-[var(--ink-2)]">Active calories</dt>
              <dd className="m-0 text-[18px] font-bold tabular-nums">{current.activeKcal} kcal</dd>
            </div>
            <div>
              <dt className="text-[12px] text-[var(--ink-2)]">Exercise</dt>
              <dd className="m-0 text-[18px] font-bold tabular-nums">{current.exerciseMinutes} min</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={sync}
            disabled={phase === 'sending'}
            className="mt-4 w-full cursor-pointer rounded-[6px] border-0 bg-[var(--accent)] py-2.5 text-[15px] font-semibold text-[var(--accent-ink)] disabled:cursor-wait disabled:opacity-70"
          >
            {phase === 'sending'
              ? 'Shortcut running…'
              : allDone
                ? 'Start the day over'
                : `Simulate Shortcut sync · ${pending.time}`}
          </button>
        </section>

        {/* The request the Shortcut sends */}
        <div className="kalo-mono overflow-hidden rounded-[10px] md:order-last md:col-span-2 bg-[var(--code)] text-[12px] leading-[1.6] text-[var(--code-ink)]">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 text-white/60">
            <span>iPhone Shortcut → app</span>
            <span>
              {phase === 'sending' ? 'sending…' : phase === 'done' ? <span className="text-[#6fd19a]">200 OK</span> : 'waiting'}
            </span>
          </div>
          <div className="overflow-x-auto px-3 py-3">
            {body ? (
              <pre key={`${phase}-${step}`} className="kalo-in m-0 whitespace-pre">
                <span className="text-[#ff9670]">POST</span> /api/health-import?key=••••••{'\n'}
                {JSON.stringify(body, null, 2)}
                {phase === 'done' && (
                  <span className="text-white/60">{`\n\n← { "ok": true, "day": "${todayIso()}", … }`}</span>
                )}
              </pre>
            ) : (
              <p className="m-0 text-white/60">
                The Shortcut reads Apple Health and posts today’s totals here. Press the button to send one.
              </p>
            )}
          </div>
        </div>

        {/* Week */}
        <section className="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] p-4" aria-label="Steps this week">
          <p className="m-0 text-[13px] text-[var(--ink-2)]">This week</p>
          <svg
            viewBox={`0 0 ${7 * BW + 6 * GAP} ${CH + 18}`}
            className="mt-3 block h-auto w-full"
            role="img"
            aria-label={`Daily steps for the last 7 days; today ${current.steps} steps`}
          >
            <line
              x1="0"
              x2={7 * BW + 6 * GAP}
              y1={CH - (GOAL / max) * CH}
              y2={CH - (GOAL / max) * CH}
              stroke="var(--ink-2)"
              strokeDasharray="3 3"
              strokeWidth="1"
              opacity="0.5"
            />
            {week.map((v, i) => {
              const h = Math.max(2, (v / max) * CH)
              const today = i === 6
              return (
                <g key={i}>
                  <rect
                    className="kalo-bar"
                    x={i * (BW + GAP)}
                    y={CH - h}
                    width={BW}
                    height={h}
                    rx="4"
                    fill={today ? 'var(--accent)' : v >= GOAL ? 'var(--good)' : 'var(--line)'}
                  />
                  <text x={i * (BW + GAP) + BW / 2} y={CH + 14} textAnchor="middle" fontSize="10" fill="var(--ink-2)">
                    {today ? 'Today' : dayLabel(i - 6)}
                  </text>
                </g>
              )
            })}
          </svg>
          <p className="m-0 mt-2 text-[12px] text-[var(--ink-2)]">Dashed line: daily goal. Green: goal reached.</p>
        </section>
      </div>
    </div>
  )
}
