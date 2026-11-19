import { lazy, Suspense } from 'react'
import type { AppInfo } from '../data/apps'

// The phone pulls in the four apps' screens, so it loads after the text has painted.
const Showcase = lazy(() => import('./Showcase'))

type Props = { apps: AppInfo[]; onOpen: (app: AppInfo, trigger: HTMLElement) => void }

export function Hero({ apps, onOpen }: Props) {
  return (
    <header className="grid items-center gap-12 pt-14 pb-16 sm:pt-24 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-8 md:pb-24">
      <div>
        <h1 className="m-0 text-[clamp(3rem,9vw,5.25rem)] leading-[0.98] font-semibold tracking-[-0.035em]">Jonathan Zehavi</h1>
        <p className="mt-5 mb-0 max-w-[16ch] text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.1] font-semibold tracking-[-0.025em]">
          I build tools that replace spreadsheets and paperwork.
        </p>
        <p className="mt-5 mb-0 text-[16px] text-text-2 sm:text-[18px]">
          Full-stack developer <span aria-hidden="true">·</span>
          <span className="sr-only">,</span> AI &amp; automation builder
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#apps"
            className="inline-flex items-center gap-2 rounded-full bg-text px-6 py-3 text-[15px] font-medium text-bg no-underline hover:opacity-85"
          >
            See what I’ve built
            <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
              <path d="M6 1.5v8.5M2.5 6.5 6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/jonathan-zehavi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-line px-6 py-3 text-[15px] font-medium text-text no-underline hover:bg-well"
          >
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className="relative isolate">
        {/* A soft wash so the phone sits on something, not on blank page */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[-8%] top-[4%] bottom-[22%] -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_50%_45%,rgb(179_38_30/0.10),transparent_70%),radial-gradient(50%_50%_at_75%_70%,rgb(15_110_86/0.10),transparent_70%),radial-gradient(45%_45%_at_25%_75%,rgb(209_138_78/0.10),transparent_70%)]"
        />
        <Suspense fallback={<div className="h-[calc(min(560px,64dvh)+116px)]" />}>
          <Showcase apps={apps} onOpen={onOpen} />
        </Suspense>
      </div>
    </header>
  )
}
