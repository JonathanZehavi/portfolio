import { useId, useMemo, useState } from 'react'
import { shekels, whatIf } from './afford'
import './demo.css'

const BALANCE = 11_480
const CARDS = [
  { name: 'Visa ·· 4417', date: 'on the 10th', amount: 3_920 },
  { name: 'Mastercard ·· 0832', date: 'on the 2nd', amount: 1_310 },
]
const LOAN = 1_150
const GOAL = { name: 'Japan trip', amount: 1_500 }
/** Income minus usual spending and loans: what a normal month adds. */
const MONTHLY_SURPLUS = 2_600
const PLANS = [1, 3, 6, 12]

const monthName = (offset: number) =>
  new Date(new Date().getFullYear(), new Date().getMonth() + offset, 1).toLocaleString('en-US', { month: 'long' })

function Ring({ pct }: { pct: number }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 56 56" className="size-14 shrink-0" aria-hidden="true">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="5" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${(c * pct) / 100} ${c}`}
        transform="rotate(-90 28 28)"
      />
      <text x="28" y="32" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">
        {pct}%
      </text>
    </svg>
  )
}

export default function TelemDemo() {
  const [cardsOn, setCardsOn] = useState(true)
  const [goalOn, setGoalOn] = useState(true)
  const [price, setPrice] = useState('9500')
  const [plan, setPlan] = useState(1)
  const priceId = useId()

  const cardTotal = cardsOn ? CARDS.reduce((a, c) => a + c.amount, 0) : 0
  const safe = BALANCE - cardTotal - LOAN - (goalOn ? GOAL.amount : 0)
  const pct = Math.max(0, Math.min(100, Math.round((safe / BALANCE) * 100)))

  const amount = Number(price.replace(/[^\d.]/g, '')) || 0
  const result = useMemo(() => (amount > 0 ? whatIf(safe, MONTHLY_SURPLUS, amount, plan) : null), [amount, safe, plan])

  const rows = [
    { label: 'Checking balance', sub: 'Today', value: BALANCE, sign: 1, on: true },
    ...CARDS.map((c) => ({ label: c.name, sub: `Card charge ${c.date}`, value: c.amount, sign: -1, on: cardsOn })),
    { label: 'Car loan', sub: 'Monthly payment', value: LOAN, sign: -1, on: true },
    { label: GOAL.name, sub: 'Savings goal, this month', value: GOAL.amount, sign: -1, on: goalOn },
  ]

  return (
    <div className="telem overflow-hidden rounded-2xl border border-[var(--border)] p-3 sm:p-4">
      {/* Hero: what is free to spend this month */}
      <div className="telem-hero flex items-center justify-between gap-3 rounded-2xl p-4 text-white">
        <div className="min-w-0">
          <p className="m-0 text-[12px] font-medium text-white/80">Safe to spend this month</p>
          <p
            className={`telem-num m-0 mt-1 text-[30px] leading-none font-extrabold tracking-tight tabular-nums sm:text-[36px] ${safe < 0 ? 'text-rose-200' : ''}`}
            aria-live="polite"
          >
            {shekels(safe)}
          </p>
          <p className="m-0 mt-2 text-[12px] text-white/75">Checking and credit cards together, before you spend.</p>
        </div>
        <Ring pct={pct} />
      </div>

      {/* Breakdown */}
      <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-2">
        <ul className="m-0 list-none p-0">
          {rows.map((r) => (
            <li
              key={r.label}
              className={`flex items-center justify-between gap-3 border-b border-[var(--border)] py-2 text-[13px] last:border-0 ${r.on ? '' : 'opacity-40'}`}
            >
              <span className="min-w-0">
                {r.label}
                <span className="block text-[11px] text-[var(--muted)]">{r.sub}</span>
              </span>
              <span className={`shrink-0 font-bold tabular-nums ${r.sign < 0 ? '' : 'text-[var(--good)]'}`}>
                {r.sign < 0 ? shekels(-r.value) : shekels(r.value)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-[var(--border)] py-2.5 text-[13px]">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={cardsOn} onChange={(e) => setCardsOn(e.target.checked)} className="size-4 accent-[#0f6e56]" />
            Count upcoming card charges
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={goalOn} onChange={(e) => setGoalOn(e.target.checked)} className="size-4 accent-[#0f6e56]" />
            Keep saving for {GOAL.name}
          </label>
        </div>
      </div>

      {/* Can I afford it? */}
      <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
        <label htmlFor={priceId} className="block text-[15px] font-bold">
          Can I afford it?
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex h-10 min-w-0 flex-1 basis-full items-center rounded-xl sm:basis-0 border border-[var(--border)] bg-[var(--page)] px-3 focus-within:border-[var(--brand-600)]">
            <span className="text-[var(--muted)]" aria-hidden="true">
              ₪
            </span>
            <input
              id={priceId}
              inputMode="numeric"
              value={price ? Number(price).toLocaleString('en-US') : ''}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, '').slice(0, 7))}
              placeholder="Price, e.g. a new laptop"
              className="w-full min-w-0 border-0 bg-transparent px-1.5 text-[16px] font-bold text-[var(--text)] tabular-nums outline-none"
            />
          </div>
          <div role="radiogroup" aria-label="Payments" className="flex h-10 flex-1 overflow-hidden sm:flex-none rounded-xl border border-[var(--border)]">
            {PLANS.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={plan === n}
                onClick={() => setPlan(n)}
                className={`flex-1 cursor-pointer border-0 px-3 text-[13px] font-bold tabular-nums ${
                  plan === n ? 'bg-[var(--brand-600)] text-white' : 'bg-transparent text-[var(--muted)]'
                }`}
              >
                {n === 1 ? 'Once' : `×${n}`}
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="mt-3 min-h-[3.25rem]">
          {result &&
            (result.affordableNow ? (
              <p key={`ok-${amount}-${plan}-${safe}`} className="telem-result m-0 rounded-xl bg-[var(--good)]/10 px-3 py-2.5 text-[14px]">
                <strong className="text-[var(--good)]">You can afford it.</strong>{' '}
                <span className="text-[var(--muted)]">
                  {plan === 1 ? 'Paid in full' : `${plan} payments of ${shekels(amount / plan)}`}, your balance stays above zero
                  every month.
                </span>
              </p>
            ) : result.waitMonths ? (
              <p key={`wait-${amount}-${plan}-${safe}`} className="telem-result m-0 rounded-xl bg-[var(--gold)]/15 px-3 py-2.5 text-[14px]">
                <strong className="text-[var(--gold-ink)]">Wait until {monthName(result.waitMonths)}.</strong>{' '}
                <span className="text-[var(--muted)]">
                  Buying it now would take you below zero; by then your monthly surplus covers it.
                </span>
              </p>
            ) : (
              <p key={`no-${amount}-${plan}-${safe}`} className="telem-result m-0 rounded-xl bg-[var(--bad)]/10 px-3 py-2.5 text-[14px]">
                <strong className="text-[var(--bad)]">Not within two years.</strong>{' '}
                <span className="text-[var(--muted)]">Try more payments or a lower price.</span>
              </p>
            ))}
        </div>
      </div>
    </div>
  )
}
