import type { CSSProperties } from 'react'
import type { AppInfo } from '../data/apps'
import { Reveal } from './Reveal'

type Props = {
  apps: AppInfo[]
  onOpen: (app: AppInfo, trigger: HTMLElement) => void
}

/** One card per app: icon, headline, one number, in the app's own colour. The first app is featured. */
export function AppCards({ apps, onOpen }: Props) {
  return (
    <section id="apps" aria-labelledby="apps-title" className="scroll-mt-6 border-t border-line py-16 sm:py-24">
      <Reveal>
        <h2 id="apps-title" className="m-0 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
          Things I’ve built
        </h2>
        <p className="mt-3 mb-0 max-w-[48ch] text-[17px] leading-[1.5] text-text-2 sm:text-[19px]">
          Each one took something people did by hand and made it automatic. Open one to see how it works, then try it.
        </p>
      </Reveal>

      <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app, i) => (
          <Reveal as="li" key={app.id} className={i === 0 ? 'sm:col-span-2 lg:col-span-3' : ''} style={{ transitionDelay: `${i * 90}ms` }}>
            <button
              type="button"
              onClick={(e) => onOpen(app, e.currentTarget)}
              aria-haspopup="dialog"
              className="app-card group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-6 text-left text-text sm:p-8"
              style={{ '--accent': app.accent } as CSSProperties}
            >
              <span aria-hidden="true" className="app-card__wash" />
              <span className={`relative flex flex-1 ${i === 0 ? 'flex-col gap-8 md:flex-row md:items-end md:justify-between' : 'flex-col'}`}>
                <span className="block">
                  <span
                    className="block size-14 overflow-hidden rounded-[22.5%] shadow-[0_2px_4px_rgb(0_0_0/0.12),0_8px_20px_rgb(0_0_0/0.10)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none sm:size-16"
                    style={{ background: app.color }}
                  >
                    <app.Icon />
                  </span>
                  <span className="mt-6 block text-[14px] font-semibold text-text-2">{app.name}</span>
                  <span
                    className={`mt-1 block font-semibold tracking-[-0.025em] text-balance ${i === 0 ? 'max-w-[18ch] text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.05]' : 'text-[24px] leading-[1.15]'}`}
                  >
                    {app.headline}
                  </span>
                </span>
                <span className={`block ${i === 0 ? 'md:text-right' : 'mt-auto pt-8'}`}>
                  <span className={`block font-semibold tracking-[-0.03em] tabular-nums ${i === 0 ? 'text-[clamp(2.25rem,5vw,3.5rem)]' : 'text-[30px]'} leading-none`}>
                    {app.highlight.value}
                  </span>
                  <span className="mt-1.5 block text-[14px] text-text-2">{app.highlight.label}</span>
                </span>
              </span>
              <span className="relative mt-7 flex items-center gap-1.5 text-[15px] font-medium">
                See how it works
                <svg
                  viewBox="0 0 12 12"
                  width="11"
                  height="11"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  <path d="M1.5 6h8.5M6.5 2.5 10 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
                </svg>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
