import { ScrollStory, type Chapter } from '../../components/story/ScrollStory'
import { CountUp } from '../../components/story/CountUp'
import { Layer } from '../../components/story/Phone'
import { d } from '../../components/story/delay'
import './demo.css'

const TARGET = 2_350
const FOOD = [
  ['Pita', '×2', 330],
  ['Hummus', '4 tbsp', 220],
  ['Coke Zero', '330 ml', 1],
] as const
const STEPS = 8_200

const chapters: Chapter[] = [
  {
    title: 'A target that is yours',
    body: 'Age, height, weight and goal go in once. Kalo works out a daily calorie target with the Mifflin-St Jeor formula.',
    stat: { value: TARGET, suffix: ' kcal', label: 'daily target in this example' },
  },
  {
    title: 'Log a meal the way you’d say it',
    body: 'Type “2 pitas with hummus and a Coke Zero”, in Hebrew or English, and it becomes itemised calories. This runs on the phone, no AI call needed. Barcode scan and photo logging are there too.',
  },
  {
    title: 'Activity logs itself',
    body: 'An iOS Shortcut reads Apple Health three times a day and posts steps, active calories and exercise minutes to Kalo’s endpoint. Nobody types them in.',
    stat: { value: STEPS, label: 'steps synced from iPhone Health' },
  },
  {
    title: 'The workout follows what you ate',
    body: 'Over the target? The day’s workout grows to match, or the overage is spread over the next days through training and food, as you choose, within fixed safety limits.',
  },
]

export function Screen({ active }: { active: number }) {
  const r = 70
  const c = 2 * Math.PI * r
  return (
    <div className="relative h-full bg-[var(--bg)] text-[13px] text-[var(--ink)]">
      {/* 0: target */}
      <Layer on={active === 0} className="px-4 pt-4">
        <p className="st m-0 text-[20px] font-bold" style={d(0)}>
          Your plan
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['31 years', '178 cm', '82 kg', 'Lose 0.5 kg / week'].map((t, i) => (
            <span key={t} className="st rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-[12px]" style={d(100 + i * 90)}>
              {t}
            </span>
          ))}
        </div>
        <div className="st mt-5 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] p-5 text-center" style={d(450)}>
          <svg viewBox="0 0 170 170" className="mx-auto block w-44">
            <circle cx="85" cy="85" r={r} fill="none" stroke="var(--line)" strokeWidth="12" />
            <circle
              cx="85"
              cy="85"
              r={r}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="12"
              strokeLinecap="round"
              transform="rotate(-90 85 85)"
              style={{ strokeDasharray: `${active === 0 ? c : 0} ${c}`, transition: 'stroke-dasharray 1200ms cubic-bezier(.2,.8,.2,1) 500ms' }}
            />
            <text x="85" y="86" textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--ink)" className="tabular-nums">
              {active === 0 ? TARGET.toLocaleString('en-US') : ''}
            </text>
            <text x="85" y="108" textAnchor="middle" fontSize="12" fill="var(--ink-2)">
              kcal a day
            </text>
          </svg>
          <p className="m-0 mt-2 text-[11px] text-[var(--ink-2)]">Mifflin-St Jeor · moderately active</p>
        </div>
      </Layer>

      {/* 1: free-text food */}
      <Layer on={active === 1} className="px-4 pt-4">
        <p className="st m-0 text-[20px] font-bold" style={d(0)}>
          Dinner
        </p>
        <div className="st mt-3 overflow-hidden rounded-[10px] border-2 border-[var(--ink)] bg-[var(--surface)] px-3 py-3 text-[14px]" style={d(100)}>
          <span className="inline-block overflow-hidden whitespace-nowrap align-bottom">
            <span className="st-type inline-block" style={d(200)}>
              2 pitas with hummus and a Coke Zero
            </span>
          </span>
        </div>
        <div className="mt-3 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-3">
          {FOOD.map(([n, q, k], i) => (
            <div key={n} className="st flex items-center justify-between border-b border-[var(--line)] py-2.5 last:border-0" style={d(1100 + i * 180)}>
              <span>
                {n} <span className="text-[var(--ink-2)]">· {q}</span>
              </span>
              <span className="kalo-mono font-semibold tabular-nums">{k} kcal</span>
            </div>
          ))}
        </div>
        <div className="st mt-3 flex items-center justify-between rounded-[10px] bg-[var(--ink)] px-3 py-3 text-[var(--bg)]" style={d(1700)}>
          <span className="font-semibold">Added to today</span>
          <span className="kalo-mono font-bold tabular-nums">{FOOD.reduce((a, f) => a + f[2], 0)} kcal</span>
        </div>
        <p className="st m-0 mt-3 text-center text-[11px] text-[var(--ink-2)]" style={d(1900)}>
          Parsed on the device
        </p>
      </Layer>

      {/* 2: health sync */}
      <Layer on={active === 2} className="px-4 pt-4">
        <div className="st flex items-center gap-2 rounded-[10px] bg-[#2b2a27] px-3 py-2.5 text-[12px] text-white" style={d(0)}>
          <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-[#5b6cff] to-[#e14ad1] text-[11px]">⌘</span>
          Shortcut “Kalo sync” · 18:00
          <span className="ml-auto text-[#6fd19a]">Done</span>
        </div>
        <pre className="kalo-mono st m-0 mt-3 rounded-[10px] bg-[#1c1b18] px-3 py-3 text-[11px] leading-[1.55] text-[#f4f0e8]" style={d(200)}>
          <span className="text-[#ff9670]">POST</span> /api/health-import{'\n'}
          {'{\n  "activeKcal": 540,\n  "steps": 8200,\n  "exerciseMinutes": 35\n}'}
        </pre>
        <div className="st mt-3 flex items-center gap-4 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] p-4" style={d(700)}>
          <svg viewBox="0 0 80 80" className="size-20 shrink-0">
            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--line)" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              pathLength={100}
              style={{ strokeDasharray: `${active === 2 ? 82 : 0} 100`, transition: 'stroke-dasharray 1100ms cubic-bezier(.2,.8,.2,1) 900ms' }}
            />
          </svg>
          <div>
            <p className="m-0 text-[12px] text-[var(--ink-2)]">Steps today</p>
            <p className="m-0 text-[26px] font-bold tabular-nums">
              <CountUp run={active === 2} value={STEPS} />
            </p>
            <p className="m-0 text-[11px] text-[var(--ink-2)]">540 kcal active · 35 min</p>
          </div>
        </div>
      </Layer>

      {/* 3: workout adapts */}
      <Layer on={active === 3} className="px-4 pt-4">
        <div className="st rounded-[10px] bg-[var(--accent-soft)] px-3 py-2.5" style={d(0)}>
          <p className="m-0 font-semibold text-[var(--accent)]">280 kcal over today’s target</p>
          <p className="m-0 text-[12px] text-[var(--ink-2)]">Dinner out ran over. How do you want to balance it?</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['Train it off', 'Spread over 3 days', 'Eat lighter tomorrow'].map((t, i) => (
            <span
              key={t}
              className={`st rounded-full border px-2.5 py-1 text-[12px] ${i === 1 ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-[var(--line)] bg-[var(--surface)]'}`}
              style={d(200 + i * 100)}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="st mt-4 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] p-4" style={d(600)}>
          <div className="flex items-baseline justify-between">
            <p className="m-0 text-[17px] font-bold">Today · Gym</p>
            <span className="kalo-mono text-[12px] text-[var(--accent)]">+12 min</span>
          </div>
          {[
            ['Rowing', '12 min'],
            ['Goblet squat', '3 × 10'],
            ['Incline walk', '15 min'],
            ['Push-ups', '3 × 12'],
          ].map(([n, v], i) => (
            <div key={n} className="st flex justify-between border-t border-[var(--line)] py-2" style={d(800 + i * 120)}>
              <span>{n}</span>
              <span className="kalo-mono text-[var(--ink-2)]">{v}</span>
            </div>
          ))}
        </div>
        <p className="st m-0 mt-3 text-[11px] text-[var(--ink-2)]" style={d(1400)}>
          The other 190 kcal come off Tuesday and Wednesday.
        </p>
      </Layer>
    </div>
  )
}

export default function KaloStory() {
  return <ScrollStory chapters={chapters} Screen={Screen} screenBg="var(--bg)" themeClass="kalo" />
}
