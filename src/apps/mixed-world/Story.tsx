import { ScrollStory, type Chapter } from '../../components/story/ScrollStory'
import { Layer } from '../../components/story/Phone'
import { d } from '../../components/story/delay'
import './demo.css'

const SHELF = [
  { name: 'Bourbon', tint: '#b8742f', has: true },
  { name: 'London Dry Gin', tint: '#cfe3e6', has: true },
  { name: 'White Rum', tint: '#e8e2d2', has: true },
  { name: 'Campari', tint: '#c3242f', has: false, flips: true },
  { name: 'Sweet Vermouth', tint: '#6b1f22', has: false },
  { name: 'Blanco Tequila', tint: '#e9e6da', has: false },
  { name: 'Angostura', tint: '#7a2a12', has: true },
  { name: 'Simple Syrup', tint: '#f1ead2', has: true },
  { name: 'Cointreau', tint: '#f0d9a0', has: false },
]

const chapters: Chapter[] = [
  {
    title: 'Your bar, bottle by bottle',
    body: 'About 130 common bottles come preloaded with photos. Mark the ones on your shelf: green you have, red you don’t.',
  },
  {
    title: 'Recipes know your shelf',
    body: 'A recipe never stores whether you have something. It reads your shelf every time, so buying one bottle updates every recipe that uses it.',
  },
  {
    title: '“What can I make?”',
    body: 'One tap filters the library down to the drinks you can make tonight with what is already at home.',
  },
  {
    title: 'Share with friends',
    body: 'Send a recipe to a friend. It arrives as a real card they can save to their own library, not as pasted text.',
  },
]

function Bottle({ tint }: { tint: string }) {
  return (
    <svg viewBox="0 0 40 72" className="mx-auto block h-14">
      <path d="M16 2h8v14c0 3 8 6 8 14v36a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V30c0-8 8-11 8-14z" fill="#1a1a1d" stroke="#4e4e57" />
      <path d="M9 38h22v28a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" fill={tint} opacity="0.9" />
    </svg>
  )
}

function Pill({ ok, delay = 0 }: { ok: boolean; delay?: number }) {
  return (
    <span
      className="inline-block size-2 rounded-full"
      style={{ background: ok ? 'var(--ok)' : 'var(--warn)', transition: `background 400ms ease ${delay}ms` }}
    />
  )
}

function Screen({ active }: { active: number }) {
  // Campari is bought while you watch: it turns green a moment after the shelf appears.
  const campari = active === 0
  return (
    <div className="relative h-full bg-[var(--canvas)] text-[13px] text-[var(--ink)]">
      <div className="absolute top-0 right-0 left-0 z-[5] flex h-11 items-center justify-between bg-[#0b0f14] px-4">
        <img src="/apps/mixed-world-logo.webp" alt="" className="h-7 w-auto" />
        <span className="flex flex-col gap-[3px]">
          <span className="block h-px w-4 bg-[var(--ink)]" />
          <span className="block h-px w-4 bg-[var(--ink)]" />
          <span className="block h-px w-4 bg-[var(--ink)]" />
        </span>
      </div>

      {/* 0: shelf */}
      <Layer on={active === 0} className="px-3 pt-14">
        <p className="st m-0 border-b border-[var(--line)] pb-2 text-[24px]" style={d(0)}>
          Ingredients
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {SHELF.map((b, i) => (
            <div key={b.name} className="st rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 text-center" style={d(80 + i * 60)}>
              <Bottle tint={b.tint} />
              <p className="m-0 mt-1 truncate text-[11px]">{b.name}</p>
              <p className="m-0 mt-1 flex items-center justify-center gap-1 text-[10px] text-[var(--muted)]">
                <Pill ok={b.flips ? campari : b.has} delay={b.flips ? 1400 : 0} />
                {b.flips ? (
                  <span className="grid">
                    <span className="[grid-area:1/1]" style={{ opacity: campari ? 0 : 1, transition: 'opacity 300ms ease 1400ms' }}>
                      Missing
                    </span>
                    <span className="[grid-area:1/1]" style={{ opacity: campari ? 1 : 0, transition: 'opacity 300ms ease 1400ms' }}>
                      On the shelf
                    </span>
                  </span>
                ) : b.has ? (
                  'On the shelf'
                ) : (
                  'Missing'
                )}
              </p>
            </div>
          ))}
        </div>
      </Layer>

      {/* 1: a recipe reads the shelf */}
      <Layer on={active === 1} className="px-3 pt-14">
        <p className="st m-0 border-b border-[var(--line)] pb-2 text-[24px]" style={d(0)}>
          Cocktails
        </p>
        <div className="st mt-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4" style={d(100)}>
          <div className="flex items-baseline justify-between">
            <p className="m-0 text-[22px]">Negroni</p>
            <span className="text-[11px] text-[var(--faint)]">Rocks</span>
          </div>
          {[
            ['London Dry Gin', '30 ML', true],
            ['Campari', '30 ML', true],
            ['Sweet Vermouth', '30 ML', false],
          ].map(([n, p, ok], i) => (
            <div key={n as string} className="st flex justify-between py-1.5 text-[14px]" style={d(250 + i * 150)}>
              <span style={{ color: ok ? 'var(--ok)' : 'var(--warn)' }}>{n}</span>
              <span className="text-[var(--muted)]">{p}</span>
            </div>
          ))}
          <p className="st m-0 mt-2 border-t border-[var(--line)] pt-2 text-[12px] text-[var(--faint)]" style={d(750)}>
            Missing 1
          </p>
          <p className="st m-0 mt-1 text-[12px] text-[var(--accent)]" style={d(900)}>
            Replace with a bottle you have →
          </p>
        </div>
        <p className="st m-0 mt-4 text-[12px] leading-[1.5] text-[var(--muted)]" style={d(1000)}>
          Stir all three with ice until chilled. Strain over a large cube, express an orange peel.
        </p>
      </Layer>

      {/* 2: what can I make */}
      <Layer on={active === 2} className="px-3 pt-14">
        <div className="st flex items-center justify-between border-b border-[var(--line)] pb-2" style={d(0)}>
          <p className="m-0 text-[24px]">Cocktails</p>
          <span className="rounded-lg border border-[var(--accent)] bg-[var(--raised)] px-2.5 py-1.5 text-[12px]">
            What can I make? <span className="text-[var(--accent)]">2</span>
          </span>
        </div>
        {[
          ['Old Fashioned', 'Bourbon · Simple Syrup · Angostura', true],
          ['Daiquiri', 'White Rum · Lime Juice · Simple Syrup', true],
          ['Negroni', 'Missing Sweet Vermouth', false],
          ['Margarita', 'Missing 2', false],
          ['Whiskey Sour', 'Missing Lemon Juice', false],
        ].map(([n, sub, ok], i) => (
          <div
            key={n as string}
            className="st mt-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
            style={{ ...d(150 + i * 110), opacity: ok ? undefined : 0.35 }}
          >
            <p className="m-0 text-[18px]">{n}</p>
            <p className="m-0 mt-0.5 text-[12px]" style={{ color: ok ? 'var(--ok)' : 'var(--faint)' }}>
              {sub}
            </p>
          </div>
        ))}
      </Layer>

      {/* 3: share */}
      <Layer on={active === 3} className="flex flex-col px-3 pt-14">
        <p className="st m-0 border-b border-[var(--line)] pb-2 text-[18px]" style={d(0)}>
          Noa
        </p>
        <div className="st mt-4 ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[var(--accent-soft,#33271a)] px-3.5 py-2.5" style={d(150)}>
          Made this last night. You have everything for it.
          <div className="mt-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
            <p className="m-0 text-[17px]">Daiquiri</p>
            <p className="m-0 text-[11px] text-[var(--muted)]">White Rum 60 · Lime 25 · Syrup 20 ML</p>
          </div>
          <p className="m-0 mt-1 text-right text-[10px] text-[var(--accent)]">✓✓ Read</p>
        </div>
        <div className="st mt-3 max-w-[85%] rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5" style={d(800)}>
          Saving it now
        </div>
        <div className="st mt-3 flex items-center gap-2 self-center rounded-full border border-[var(--ok)]/50 bg-[var(--ok-soft)] px-3 py-1.5 text-[12px] text-[var(--ok)]" style={d(1200)}>
          ✓ Saved to my library
        </div>
      </Layer>
    </div>
  )
}

export default function MixedWorldStory() {
  return <ScrollStory chapters={chapters} Screen={Screen} screenBg="var(--canvas)" themeClass="mixed" />
}
