import { useState } from 'react'
import './demo.css'

type Bottle = { id: string; name: string }

const BOTTLES: Bottle[] = [
  { id: 'bourbon', name: 'Bourbon' },
  { id: 'gin', name: 'London Dry Gin' },
  { id: 'rum', name: 'White Rum' },
  { id: 'tequila', name: 'Blanco Tequila' },
  { id: 'cointreau', name: 'Cointreau' },
  { id: 'campari', name: 'Campari' },
  { id: 'vermouth', name: 'Sweet Vermouth' },
  { id: 'bitters', name: 'Angostura Bitters' },
  { id: 'syrup', name: 'Simple Syrup' },
  { id: 'lime', name: 'Lime Juice' },
]

/** Four of the app's starter recipes, same portions. */
const COCKTAILS: { name: string; glass: string; rows: { id: string; portion: string }[] }[] = [
  {
    name: 'Old Fashioned',
    glass: 'Rocks',
    rows: [
      { id: 'bitters', portion: 'Dash' },
      { id: 'syrup', portion: '10 ML' },
      { id: 'bourbon', portion: '60 ML' },
    ],
  },
  {
    name: 'Margarita',
    glass: 'Martini',
    rows: [
      { id: 'cointreau', portion: '20 ML' },
      { id: 'lime', portion: '20 ML' },
      { id: 'tequila', portion: '50 ML' },
    ],
  },
  {
    name: 'Negroni',
    glass: 'Rocks',
    rows: [
      { id: 'gin', portion: '30 ML' },
      { id: 'campari', portion: '30 ML' },
      { id: 'vermouth', portion: '30 ML' },
    ],
  },
  {
    name: 'Daiquiri',
    glass: 'Coupe',
    rows: [
      { id: 'syrup', portion: '20 ML' },
      { id: 'lime', portion: '25 ML' },
      { id: 'rum', portion: '60 ML' },
    ],
  },
]

const nameOf = (id: string) => BOTTLES.find((b) => b.id === id)?.name ?? id

export default function MixedWorldDemo() {
  const [shelf, setShelf] = useState<Set<string>>(() => new Set(['bourbon', 'gin', 'rum', 'bitters', 'syrup', 'lime']))
  const [onlyMakeable, setOnlyMakeable] = useState(false)

  const toggle = (id: string) =>
    setShelf((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const makeable = (c: (typeof COCKTAILS)[number]) => c.rows.every((r) => shelf.has(r.id))
  const count = COCKTAILS.filter(makeable).length
  const shown = onlyMakeable ? COCKTAILS.filter(makeable) : COCKTAILS

  return (
    <div className="mixed overflow-hidden rounded-2xl border border-[var(--line)] p-4">
      <h3 className="m-0 text-[20px] font-normal">My shelf</h3>
      <p className="m-0 mt-1 text-[13px] text-[var(--muted)]">Tap a bottle to mark whether you have it.</p>
      <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0" aria-label="Bottles">
        {BOTTLES.map((b) => {
          const has = shelf.has(b.id)
          return (
            <li key={b.id}>
              <button
                type="button"
                aria-pressed={has}
                onClick={() => toggle(b.id)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 font-[inherit] text-[13px] ${
                  has
                    ? 'border-[var(--ok)]/50 bg-[var(--ok-soft)] text-[var(--ok)]'
                    : 'border-[var(--warn)]/40 bg-[var(--warn-soft)] text-[var(--warn)]'
                }`}
              >
                <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-current" />
                {b.name}
                <span className="sr-only">{has ? ', on the shelf' : ', missing'}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        <h3 className="m-0 text-[20px] font-normal">Cocktails</h3>
        <button
          type="button"
          aria-pressed={onlyMakeable}
          onClick={() => setOnlyMakeable((v) => !v)}
          className={`cursor-pointer rounded-lg border px-3 py-2 font-[inherit] text-[14px] ${
            onlyMakeable
              ? 'border-[var(--accent)] bg-[var(--raised)] text-[var(--ink)]'
              : 'border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)]'
          }`}
        >
          What can I make?
          <span className="ml-2 text-[var(--accent)] tabular-nums">{count}</span>
        </button>
      </div>

      <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2" aria-live="polite">
        {shown.map((c) => {
          const ok = makeable(c)
          return (
            <li
              key={c.name}
              className="mixed-card flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgb(0_0_0/0.35)]"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="m-0 text-[19px] font-normal">{c.name}</h4>
                <span className="text-[12px] text-[var(--faint)]">{c.glass}</span>
              </div>
              <ul className="m-0 mt-2.5 list-none p-0 text-[14px]">
                {c.rows.map((r) => {
                  const has = shelf.has(r.id)
                  return (
                    <li key={r.id} className="flex justify-between gap-3 py-0.5">
                      <span className={has ? 'text-[var(--ok)]' : 'text-[var(--warn)]'}>
                        {nameOf(r.id)}
                        <span className="sr-only">{has ? '' : ' (missing)'}</span>
                      </span>
                      <span className="text-[var(--muted)] tabular-nums">{r.portion}</span>
                    </li>
                  )
                })}
              </ul>
              <p className={`m-0 mt-3 border-t border-[var(--line)] pt-2 text-[12px] ${ok ? 'text-[var(--ok)]' : 'text-[var(--faint)]'}`}>
                {ok ? 'You have everything' : `Missing ${c.rows.filter((r) => !shelf.has(r.id)).length}`}
              </p>
            </li>
          )
        })}
        {shown.length === 0 && (
          <li className="rounded-xl border border-dashed border-[var(--line-strong)] p-6 text-center text-[14px] text-[var(--muted)] sm:col-span-2">
            Nothing yet. Mark a few more bottles as on the shelf.
          </li>
        )}
      </ul>
    </div>
  )
}
