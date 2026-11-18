import { useMemo, useState } from 'react'
import { CAPACITY, DEPOT, STOPS } from './data'
import { cratesOf, planRoutes, type DriverRoute, type Point } from './plan'
import './demo.css'

const W = 320
const H = 380
const PAD = 28

// Schematic projection: fit the box, not to scale (the valley is long and narrow).
const lats = [DEPOT.lat, ...STOPS.map((s) => s.lat)]
const lngs = [DEPOT.lng, ...STOPS.map((s) => s.lng)]
const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)]
const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)]
const px = (p: Point) => ({
  x: PAD + ((p.lng - minLng) / (maxLng - minLng)) * (W - PAD * 2 - 40),
  y: PAD + ((maxLat - p.lat) / (maxLat - minLat)) * (H - PAD * 2),
})

const TOTAL = Math.round(STOPS.reduce((a, s) => a + cratesOf(s), 0))
const driverColor = (i: number) => `var(--d${i})`

function items(s: (typeof STOPS)[number]) {
  const parts = [`${s.pom} pomegranate crates`]
  if (s.juice) parts.push(`${s.juice} juice`)
  if (s.honey) parts.push(`${s.honey} honey`)
  return parts.join(' · ')
}

export default function MasloolDemo() {
  const [drivers, setDrivers] = useState(2)
  const [planned, setPlanned] = useState(false)
  const [focus, setFocus] = useState<string | null>(null)

  const routes: DriverRoute[] = useMemo(() => planRoutes(DEPOT, STOPS, drivers, CAPACITY), [drivers])
  const owner = useMemo(() => {
    const m = new Map<string, { driver: number; order: number }>()
    routes.forEach((r, d) => r.stops.forEach((s, i) => m.set(s.id, { driver: d, order: i + 1 })))
    return m
  }, [routes])

  const depot = px(DEPOT)

  return (
    <div className="maslool overflow-hidden rounded-2xl border border-[var(--line)]">
      {/* Strip: what was imported */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--strip)] px-4 py-3 text-[var(--on-strip)]">
        <div className="min-w-0">
          <p className="m-0 text-[15px] font-semibold">Wednesday delivery</p>
          <p className="m-0 text-[12px] opacity-75">
            orders.xlsx · {STOPS.length} stops · {TOTAL} crates
          </p>
        </div>
        <div role="radiogroup" aria-label="Number of drivers" className="flex items-center gap-2 text-[12px]">
          <span className="opacity-75">Drivers</span>
          <div className="flex overflow-hidden rounded-[2px] border border-[var(--on-strip)]/40">
            {[2, 3].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={drivers === n}
                onClick={() => setDrivers(n)}
                className={`w-9 cursor-pointer border-0 py-1.5 text-[13px] font-semibold tabular-nums ${
                  drivers === n ? 'bg-[var(--on-strip)] text-[var(--strip)]' : 'bg-transparent text-[var(--on-strip)]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:items-start">
        {/* Map */}
        <div className="border-b border-[var(--line)] md:sticky md:top-0 md:border-r md:border-b-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full"
            role="img"
            aria-label={
              planned
                ? `Schematic map: ${routes.length} routes from ${DEPOT.name}`
                : `Schematic map: ${STOPS.length} unplanned stops around ${DEPOT.name}`
            }
          >
            {planned &&
              routes.map((r, d) => {
                const pts = [depot, ...r.stops.map(px)]
                return (
                  <polyline
                    key={`${drivers}-${d}`}
                    className="maslool-route"
                    pathLength={1}
                    points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={driverColor(d)}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    style={{ animationDelay: `${d * 160}ms` }}
                  />
                )
              })}

            {STOPS.map((s) => {
              const p = px(s)
              const o = owner.get(s.id)
              const active = focus === s.id
              const side = s.label ?? (p.x > W * 0.62 ? 'left' : 'right')
              return (
                <g key={s.id}>
                  <circle
                    className="maslool-dot"
                    cx={p.x}
                    cy={p.y}
                    r={planned ? (active ? 9 : 7.5) : 4.5}
                    fill={planned && o ? driverColor(o.driver) : 'var(--ink)'}
                    stroke="var(--paper)"
                    strokeWidth={1.5}
                  />
                  {planned && o && (
                    <text
                      x={p.x}
                      y={p.y + 3.2}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill="var(--paper)"
                      className="tabular-nums"
                    >
                      {o.order}
                    </text>
                  )}
                  <text
                    x={side === 'above' ? p.x : side === 'left' ? p.x - 11 : p.x + 11}
                    y={side === 'above' ? p.y - 12 : p.y + 3.5}
                    textAnchor={side === 'above' ? 'middle' : side === 'left' ? 'end' : 'start'}
                    fontSize="10.5"
                    fill={active ? 'var(--ink)' : 'var(--mute)'}
                    fontWeight={active ? 700 : 400}
                  >
                    {s.name}
                  </text>
                </g>
              )
            })}

            {/* Depot: Maslool's square */}
            <rect x={depot.x - 7} y={depot.y - 7} width={14} height={14} fill="var(--ink)" />
            <text x={depot.x - 12} y={depot.y + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--ink)">
              {DEPOT.name}
            </text>
            <text x={W - 8} y={H - 8} textAnchor="end" fontSize="9" fill="var(--mute)">
              Schematic, not to scale
            </text>
          </svg>
        </div>

        {/* Driver sheets */}
        <div className="flex min-w-0 flex-col">
          <div className="border-b border-[var(--line)] p-4">
            {planned ? (
              <button
                type="button"
                onClick={() => setPlanned(false)}
                className="w-full cursor-pointer rounded-[2px] border border-[var(--ink)] bg-transparent py-2.5 text-[15px] font-semibold text-[var(--ink)]"
              >
                Reset
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPlanned(true)}
                className="w-full cursor-pointer rounded-[2px] border-0 bg-[var(--stamp)] py-2.5 text-[15px] font-semibold text-[var(--on-stamp)]"
              >
                Plan routes
              </button>
            )}
          </div>

          <div aria-live="polite" className="min-w-0 flex-1">
            {!planned ? (
              <p className="m-0 p-4 text-[14px] leading-[1.5] text-[var(--mute)]">
                {STOPS.length} stops from the order sheet, nobody assigned yet. Pick the number of drivers, then plan.
                Every van holds up to {CAPACITY} crates and leaves from {DEPOT.name}.
              </p>
            ) : (
              routes.map((r, d) => (
                <div
                  key={`${drivers}-${d}`}
                  className="maslool-row border-b border-[var(--line)] px-4 py-4 last:border-b-0"
                  style={{ animationDelay: `${d * 120}ms` }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="m-0 flex items-center gap-2 text-[15px] font-semibold">
                      <span className="inline-block size-3" style={{ background: driverColor(d) }} aria-hidden="true" />
                      Driver {d + 1}
                    </h3>
                    <span className="text-[12px] text-[var(--mute)] tabular-nums">
                      {r.stops.length} stops · {Math.round(r.km)} km
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3">
                    <div
                      className="h-1.5 flex-1 bg-[var(--paper-2)]"
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={CAPACITY}
                      aria-valuenow={Math.round(r.crates)}
                      aria-label={`Driver ${d + 1} van load`}
                    >
                      <div className="h-full" style={{ width: `${(r.crates / CAPACITY) * 100}%`, background: driverColor(d) }} />
                    </div>
                    <span className="text-[13px] font-semibold tabular-nums">
                      {Math.round(r.crates)}
                      <span className="font-normal text-[var(--mute)]"> / {CAPACITY} crates</span>
                    </span>
                  </div>

                  <ol className="m-0 mt-3 list-none p-0">
                    {r.stops.map((s, i) => (
                      <li
                        key={s.id}
                        tabIndex={0}
                        onMouseEnter={() => setFocus(s.id)}
                        onMouseLeave={() => setFocus(null)}
                        onFocus={() => setFocus(s.id)}
                        onBlur={() => setFocus(null)}
                        className="grid grid-cols-[1.25rem_1fr] gap-x-2 border-t border-[var(--line)] py-1.5 text-[13px] outline-offset-0 first:border-t-0"
                      >
                        <span className="font-semibold tabular-nums" style={{ color: driverColor(d) }}>
                          {i + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="font-semibold">{s.name}</span>
                          <span className="block text-[12px] text-[var(--mute)]">{items(s)}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="m-0 border-t border-[var(--line)] px-4 py-3 text-[12px] leading-[1.5] text-[var(--mute)]">
        In the app, each driver opens their own route with a Waze link per stop, and confirms every delivery with an item
        checklist and a photo.
      </p>
    </div>
  )
}
