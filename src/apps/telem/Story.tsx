import { ScrollStory, type Chapter } from '../../components/story/ScrollStory'
import { CountUp } from '../../components/story/CountUp'
import { Layer } from '../../components/story/Phone'
import { d } from '../../components/story/delay'
import { shekels, whatIf } from './afford'
import './demo.css'

const BALANCE = 11_480
const CARDS = [
  { name: 'Visa ··4417', when: 'Charges on the 10th', amount: 3_920 },
  { name: 'Mastercard ··0832', when: 'Charges on the 2nd', amount: 1_310 },
]
const LOAN = 1_150
const GOAL = 1_500
const SAFE = BALANCE - CARDS.reduce((a, c) => a + c.amount, 0) - LOAN - GOAL
const PRICE = 9_500
const WAIT = whatIf(SAFE, 2_600, PRICE, 1).waitMonths ?? 3
const monthName = (offset: number) =>
  new Date(new Date().getFullYear(), new Date().getMonth() + offset, 1).toLocaleString('en-US', { month: 'long' })

const chapters: Chapter[] = [
  {
    title: 'Checking and credit, in one view',
    body: 'Bank apps show the balance. Card apps show the charges. Telem puts both side by side, because the money on the card is already spent.',
  },
  {
    title: 'Charges that haven’t hit yet',
    body: 'Card bills, the loan payment and this month’s savings goal are taken off before you see a number, each on the date it will actually leave.',
  },
  {
    title: 'One number: safe to spend',
    body: 'What is really free this month, after everything that is already committed.',
    stat: { value: SAFE, prefix: '₪', label: 'safe to spend, in this example' },
  },
  {
    title: '“Can I afford it?”',
    body: 'Type a price and choose how many payments. Telem projects your balance month by month and tells you whether to buy now or when it will fit.',
  },
  {
    title: 'Talma finds a better price',
    body: 'Talma is an AI agent inside the app: ask for a product and it searches stores for the lowest price.',
  },
]

function Screen({ active }: { active: number }) {
  return (
    <div className="relative h-full bg-[var(--page)] text-[13px] text-[var(--text)]">
      {/* 0: two sources */}
      <Layer on={active === 0} className="px-4 pt-4">
        <p className="st m-0 text-[20px] font-extrabold" style={d(0)}>
          Good evening
        </p>
        <div className="st mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4" style={d(120)}>
          <p className="m-0 text-[12px] text-[var(--muted)]">Checking account</p>
          <p className="m-0 mt-1 text-[28px] font-extrabold tabular-nums">{shekels(BALANCE)}</p>
        </div>
        {CARDS.map((c, i) => (
          <div
            key={c.name}
            className="st mt-3 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
            style={d(260 + i * 140)}
          >
            <div>
              <p className="m-0 font-bold">{c.name}</p>
              <p className="m-0 text-[12px] text-[var(--muted)]">{c.when}</p>
            </div>
            <span className="font-bold tabular-nums">{shekels(-c.amount)}</span>
          </div>
        ))}
        <div className="st mt-5 flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-4 py-2.5 text-[12px] font-bold text-white" style={d(700)}>
          <span className="size-2 rounded-full bg-[var(--gold)]" />
          One picture of your money
        </div>
      </Layer>

      {/* 1: what is already committed */}
      <Layer on={active === 1} className="px-4 pt-4">
        <p className="st m-0 text-[12px] text-[var(--muted)]" style={d(0)}>
          This month
        </p>
        <div className="st mt-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4" style={d(60)}>
          {[
            ['Checking balance', 'Today', BALANCE],
            ...CARDS.map((c) => [c.name, c.when, -c.amount] as const),
            ['Car loan', 'Monthly payment', -LOAN],
            ['Japan trip', 'Savings goal', -GOAL],
          ].map(([label, sub, v], i) => (
            <div key={label as string} className="st flex items-center justify-between border-b border-[var(--border)] py-3 last:border-0" style={d(140 + i * 160)}>
              <span>
                {label}
                <span className="block text-[11px] text-[var(--muted)]">{sub}</span>
              </span>
              <span className={`font-bold tabular-nums ${(v as number) > 0 ? 'text-[var(--good)]' : ''}`}>{shekels(v as number)}</span>
            </div>
          ))}
        </div>
        <div className="st mt-3 flex justify-between rounded-2xl bg-[var(--brand-600)]/10 px-4 py-3 font-bold" style={d(1000)}>
          <span>Left after all of it</span>
          <span className="tabular-nums">{shekels(SAFE)}</span>
        </div>
      </Layer>

      {/* 2: safe to spend */}
      <Layer on={active === 2} className="px-4 pt-4">
        <div className="telem-hero st rounded-3xl p-5 text-white" style={d(0)}>
          <p className="m-0 text-[12px] text-white/80">Safe to spend this month</p>
          <p className="m-0 mt-2 text-[44px] leading-none font-extrabold tabular-nums">
            <CountUp run={active === 2} value={SAFE} prefix="₪" />
          </p>
          <svg viewBox="0 0 120 120" className="mx-auto mt-6 block w-36">
            <circle cx="60" cy="60" r="48" fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="11" />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="11"
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              pathLength={100}
              style={{
                strokeDasharray: `${active === 2 ? Math.round((SAFE / BALANCE) * 100) : 0} 100`,
                transition: 'stroke-dasharray 1200ms cubic-bezier(.2,.8,.2,1) 200ms',
              }}
            />
            <text x="60" y="66" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff">
              {Math.round((SAFE / BALANCE) * 100)}%
            </text>
          </svg>
          <p className="m-0 mt-3 text-center text-[12px] text-white/75">of your balance is really free</p>
        </div>
        <div className="st mt-3 grid grid-cols-3 gap-2 text-center" style={d(300)}>
          {[
            ['Income', '₪16,500'],
            ['Spent', '₪10,250'],
            ['Goals, loan', '₪2,650'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5">
              <p className="m-0 text-[11px] text-[var(--muted)]">{k}</p>
              <p className="m-0 font-bold tabular-nums">{v}</p>
            </div>
          ))}
        </div>
      </Layer>

      {/* 3: can I afford it */}
      <Layer on={active === 3} className="px-4 pt-4">
        <p className="st m-0 text-[20px] font-extrabold" style={d(0)}>
          Can I afford it?
        </p>
        <div className="st mt-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4" style={d(100)}>
          <p className="m-0 text-[12px] text-[var(--muted)]">New laptop</p>
          <p className="m-0 mt-1 text-[30px] font-extrabold tabular-nums">{shekels(PRICE)}</p>
          <div className="mt-3 flex overflow-hidden rounded-xl border border-[var(--border)] text-center text-[12px] font-bold">
            {['Once', '×3', '×6', '×12'].map((p, i) => (
              <span key={p} className={`flex-1 py-2 ${i === 0 ? 'bg-[var(--brand-600)] text-white' : 'text-[var(--muted)]'}`}>
                {p}
              </span>
            ))}
          </div>
        </div>
        {/* Balance projection */}
        <svg viewBox="0 0 288 120" className="st mt-3 block w-full" style={d(300)}>
          <line x1="0" x2="288" y1="88" y2="88" stroke="var(--border)" />
          {(() => {
            const pts = whatIf(SAFE, 2_600, PRICE, 1).points
            const y = (v: number) => 88 - v / 330
            const line = (k: 'baseline' | 'withPurchase') => pts.map((p, i) => `${(i * 288) / 9},${y(p[k])}`).join(' ')
            return (
              <>
                <polyline points={line('baseline')} fill="none" stroke="var(--muted)" strokeDasharray="4 4" strokeWidth="2" />
                <polyline className="st-draw" pathLength={1} points={line('withPurchase')} fill="none" stroke="var(--gold)" strokeWidth="3" style={d(500)} />
              </>
            )
          })()}
          <text x="4" y="104" fontSize="10" fill="var(--muted)">
            Below this line you’d be overdrawn
          </text>
        </svg>
        <div className="st mt-2 rounded-xl bg-[var(--gold)]/20 px-4 py-3" style={d(1200)}>
          <p className="m-0 font-extrabold text-[var(--gold-ink)]">Wait until {monthName(WAIT)}.</p>
          <p className="m-0 text-[12px] text-[var(--muted)]">Buying it today would take you below zero.</p>
        </div>
      </Layer>

      {/* 4: Talma */}
      <Layer on={active === 4} className="flex flex-col px-4 pt-4">
        <div className="st flex items-center gap-2" style={d(0)}>
          <span className="grid size-8 place-items-center rounded-full bg-[var(--brand-600)] text-[13px] font-extrabold text-[var(--gold)]">T</span>
          <div>
            <p className="m-0 font-extrabold">Talma</p>
            <p className="m-0 text-[11px] text-[var(--muted)]">Price search agent</p>
          </div>
        </div>
        <div className="st mt-5 ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[var(--brand-600)] px-3.5 py-2.5 text-white" style={d(200)}>
          Where’s the cheapest noise-cancelling headphones I saved?
        </div>
        <div className="st mt-3 max-w-[85%] rounded-2xl rounded-bl-md border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5" style={d(900)}>
          Checked 6 stores. Lowest right now:
          <div className="mt-2 rounded-xl bg-[var(--page)] p-3">
            <p className="m-0 text-[22px] font-extrabold tabular-nums">₪1,149</p>
            <p className="m-0 text-[11px] text-[var(--muted)]">
              <s>₪1,390</s> elsewhere · in stock
            </p>
          </div>
        </div>
        <div className="st mt-3 max-w-[85%] rounded-2xl rounded-bl-md border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5" style={d(1500)}>
          At that price it fits this month.
        </div>
        <p className="st mt-auto mb-4 text-center text-[11px] text-[var(--muted)]" style={d(1700)}>
          Sample conversation
        </p>
      </Layer>
    </div>
  )
}

export default function TelemStory() {
  return <ScrollStory chapters={chapters} Screen={Screen} screenBg="var(--page)" themeClass="telem" />
}
