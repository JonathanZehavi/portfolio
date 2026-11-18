import { CAPACITY, DEPOT, STOPS } from './data'
import { cratesOf, planRoutes, type Point } from './plan'
import { ScrollStory, type Chapter } from '../../components/story/ScrollStory'
import { Layer } from '../../components/story/Phone'
import { d } from '../../components/story/delay'
import './demo.css'

const MW = 320
const MH = 340
const PAD = 30
const lats = [DEPOT.lat, ...STOPS.map((s) => s.lat)]
const lngs = [DEPOT.lng, ...STOPS.map((s) => s.lng)]
const px = (p: Point) => ({
  x: PAD + ((p.lng - Math.min(...lngs)) / (Math.max(...lngs) - Math.min(...lngs))) * (MW - PAD * 2 - 50),
  y: PAD + ((Math.max(...lats) - p.lat) / (Math.max(...lats) - Math.min(...lats))) * (MH - PAD * 2),
})
const ROUTES = planRoutes(DEPOT, STOPS, 2, CAPACITY)
const TOTAL = Math.round(STOPS.reduce((a, s) => a + cratesOf(s), 0))
const owner = new Map<string, number>()
ROUTES.forEach((r, i) => r.stops.forEach((s) => owner.set(s.id, i)))
const SHEET = ROUTES[1] ?? ROUTES[0]
const NEXT = SHEET.stops[0]

const chapters: Chapter[] = [
  {
    title: 'The order sheet comes in',
    body: 'The evening before a delivery day, the order site exports an Excel file: one row per pickup point, a column per product. Maslool reads it as is, including the summary rows the real files open with.',
  },
  {
    title: 'Every stop lands on the map',
    body: 'Known settlements get their coordinates right away. New ones are looked up in the background and remembered for next time.',
    stat: { value: TOTAL, label: `crates across ${STOPS.length} stops` },
  },
  {
    title: 'Split by direction and van size',
    body: 'Stops are swept by direction from the depot, so a driver who finishes the Kinneret does not head south. Each route is then ordered by nearest neighbour and straightened with 2-opt.',
    stat: { value: 3, prefix: '~', suffix: ' h → minutes', label: 'planning time, the evening before' },
  },
  {
    title: 'Each driver gets their own sheet',
    body: 'Drivers sign in and see only their route: what to load, the next stop in large type, and a Waze link for every stop.',
  },
  {
    title: 'Delivered, with proof',
    body: 'A stop is confirmed only after the item checklist and a photo of what was dropped off. The manager is notified in real time.',
    stat: { value: 4, label: 'drivers on the app every delivery day' },
  },
]

function Screen({ active }: { active: number }) {
  const depot = px(DEPOT)
  const planned = active >= 2
  return (
    <div className="relative h-full text-[13px]">
      {/* 0: the spreadsheet */}
      <Layer on={active === 0} className="px-4 pt-3">
        <div className="st flex items-center gap-2" style={d(0)}>
          <span className="grid size-7 place-items-center rounded-[3px] bg-[#1d6f42] text-[11px] font-bold text-white">X</span>
          <span className="font-semibold">orders.xlsx</span>
          <span className="ml-auto text-[11px] text-[var(--mute)]">Wednesday</span>
        </div>
        <div className="st mt-3 border-y border-[var(--line)]" style={d(80)}>
          <div className="grid grid-cols-[1fr_44px_44px_44px] gap-1 border-b border-[var(--line)] bg-[var(--paper-2)] px-2 py-1.5 text-[11px] font-semibold">
            <span>Pickup point</span>
            <span className="text-right">Pom.</span>
            <span className="text-right">Juice</span>
            <span className="text-right">Honey</span>
          </div>
          {STOPS.slice(0, 10).map((s, i) => (
            <div
              key={s.id}
              className="st grid grid-cols-[1fr_44px_44px_44px] gap-1 border-b border-[var(--line)] px-2 py-1.5 tabular-nums last:border-0"
              style={d(160 + i * 60)}
            >
              <span className="truncate">{s.name}</span>
              <span className="text-right">{s.pom}</span>
              <span className="text-right">{s.juice || '·'}</span>
              <span className="text-right">{s.honey || '·'}</span>
            </div>
          ))}
        </div>
      </Layer>

      {/* 1 and 2: the map, then the routes */}
      <Layer on={active === 1 || active === 2}>
        <svg viewBox={`0 0 ${MW} ${MH}`} className="block w-full">
          {ROUTES.map((r, i) => (
            <polyline
              key={i}
              pathLength={1}
              points={[depot, ...r.stops.map(px)].map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={`var(--d${i})`}
              strokeWidth={3}
              strokeLinejoin="round"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: planned ? 0 : 1,
                transition: `stroke-dashoffset 1200ms cubic-bezier(.4,0,.2,1) ${i * 200}ms`,
              }}
            />
          ))}
          {STOPS.map((s, i) => {
            const p = px(s)
            const o = owner.get(s.id) ?? 0
            return (
              <g key={s.id} className="st" style={d(i * 70)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={planned ? 7 : 5}
                  fill={planned ? `var(--d${o})` : 'var(--ink)'}
                  stroke="var(--paper)"
                  strokeWidth={1.5}
                  style={{ transition: 'fill 500ms ease, r 300ms ease' }}
                />
                <text x={p.x + 10} y={p.y + 4} fontSize="10.5" fill="var(--mute)">
                  {s.name}
                </text>
              </g>
            )
          })}
          <rect x={depot.x - 7} y={depot.y - 7} width={14} height={14} fill="var(--ink)" />
          <text x={depot.x - 11} y={depot.y + 4} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--ink)">
            {DEPOT.name}
          </text>
        </svg>
        <div className="px-4">
          {!planned ? (
            <div className="border-t border-[var(--line)] pt-3">
              <p className="m-0 font-[inherit] text-[34px] leading-none font-bold tabular-nums">{STOPS.length} stops</p>
              <p className="m-0 mt-1 text-[var(--mute)]">{TOTAL} crates · nobody assigned yet</p>
            </div>
          ) : (
            ROUTES.map((r, i) => (
              <div key={i} className="border-t border-[var(--line)] py-2.5">
                <div className="flex justify-between text-[12px]">
                  <span className="font-semibold">Driver {i + 1}</span>
                  <span className="tabular-nums">
                    {Math.round(r.crates)} / {CAPACITY} crates · {Math.round(r.km)} km
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 bg-[var(--paper-2)]">
                  <div
                    className="h-full"
                    style={{
                      width: `${(r.crates / CAPACITY) * 100}%`,
                      background: `var(--d${i})`,
                      transform: `scaleX(${planned ? 1 : 0})`,
                      transformOrigin: 'left',
                      transition: `transform 900ms cubic-bezier(.2,.8,.2,1) ${400 + i * 200}ms`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Layer>

      {/* 3: the driver's sheet */}
      <Layer on={active === 3}>
        <div className="st bg-[var(--strip)] px-4 py-3 text-[var(--on-strip)]" style={d(0)}>
          <p className="m-0 text-[11px] opacity-75">Driver 2 · Wednesday</p>
          <p className="m-0 text-[15px] font-semibold">
            {SHEET.stops.length} stops · {Math.round(SHEET.crates)} crates to load
          </p>
        </div>
        <div className="px-4 pt-4">
          <p className="st m-0 text-[11px] font-semibold tracking-wide text-[var(--stamp)] uppercase" style={d(120)}>
            Next stop
          </p>
          <p className="st m-0 text-[40px] leading-[1.05] font-bold" style={d(180)}>
            {NEXT.name}
          </p>
          <ul className="m-0 mt-3 list-none border-t border-[var(--line)] p-0">
            {[
              [`${NEXT.pom}`, 'Pomegranate crates'],
              [`${NEXT.juice}`, 'Juice bottles'],
              [`${NEXT.honey}`, 'Honey jars'],
            ]
              .filter(([n]) => n !== '0')
              .map(([n, label], i) => (
                <li key={label} className="st flex justify-between border-b border-[var(--line)] py-2" style={d(260 + i * 80)}>
                  <span>{label}</span>
                  <span className="font-bold tabular-nums">{n}</span>
                </li>
              ))}
          </ul>
          <div className="st mt-4 rounded-[2px] bg-[var(--stamp)] py-3 text-center font-semibold text-[var(--on-stamp)]" style={d(500)}>
            Navigate in Waze
          </div>
          <ol className="m-0 mt-4 list-none p-0 text-[12px] text-[var(--mute)]">
            {SHEET.stops.slice(1, 5).map((s, i) => (
              <li key={s.id} className="st flex gap-2 py-1" style={d(600 + i * 60)}>
                <span className="w-4 tabular-nums">{i + 2}</span>
                {s.name}
              </li>
            ))}
          </ol>
        </div>
      </Layer>

      {/* 4: delivery confirmation */}
      <Layer on={active === 4} className="px-4 pt-3">
        <div
          className="st absolute top-2 right-3 left-3 z-10 flex items-center gap-2 rounded-[4px] bg-[var(--strip)] px-3 py-2.5 text-[12px] text-[var(--on-strip)]"
          style={d(1300)}
        >
          <span className="size-2 rounded-full bg-[#7dc48a]" />
          Manager notified · {NEXT.name} delivered
        </div>
        <p className="st m-0 mt-14 text-[22px] font-bold" style={d(0)}>
          {NEXT.name}
        </p>
        <p className="st m-0 text-[12px] text-[var(--mute)]" style={d(60)}>
          Confirm what you dropped off
        </p>
        <ul className="m-0 mt-3 list-none p-0">
          {['Pomegranate crates', 'Juice bottles', 'Honey jars'].map((label, i) => (
            <li key={label} className="st flex items-center gap-3 border-b border-[var(--line)] py-2.5" style={d(150 + i * 220)}>
              <span className="grid size-5 place-items-center rounded-[2px] bg-[var(--ink)] text-[12px] text-[var(--paper)]">✓</span>
              {label}
            </li>
          ))}
        </ul>
        <div className="st mt-4 overflow-hidden rounded-[2px] border border-[var(--line)]" style={d(800)}>
          <svg viewBox="0 0 288 130" className="block w-full bg-[var(--paper-2)]">
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect key={`${r}${c}`} x={36 + c * 56} y={18 + r * 34} width={50} height={30} rx={2} fill="#8E2C3B" opacity={0.75 - r * 0.15} />
              )),
            )}
          </svg>
          <p className="m-0 px-3 py-1.5 text-[11px] text-[var(--mute)]">Photo attached</p>
        </div>
        <div className="st mt-4 rounded-[2px] bg-[var(--ink)] py-3 text-center font-semibold text-[var(--paper)]" style={d(1000)}>
          Delivery confirmed
        </div>
      </Layer>
    </div>
  )
}

export default function MasloolStory() {
  return <ScrollStory chapters={chapters} Screen={Screen} screenBg="var(--paper)" themeClass="maslool" />
}
