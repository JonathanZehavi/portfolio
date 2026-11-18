import type { AppInfo } from '../data/apps'
import { Reveal } from './Reveal'

type Props = {
  apps: AppInfo[]
  onOpen: (app: AppInfo, trigger: HTMLElement) => void
}

/** The apps as a home-screen row: rounded icon, small name underneath. */
export function AppGrid({ apps, onOpen }: Props) {
  return (
    <Reveal as="section" aria-labelledby="apps-title" className="border-t border-line py-14 sm:py-20">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="apps-title" className="text-[13px] font-semibold tracking-[0.06em] text-text-2 uppercase">
          Apps
        </h2>
        <p className="text-[13px] text-text-2">Tap one to try a live demo</p>
      </div>

      <div className="mt-8 rounded-[28px] bg-well px-3 py-8 sm:px-10 sm:py-14">
        <ul className="m-0 grid list-none grid-cols-4 gap-x-2 gap-y-8 p-0 sm:gap-x-6">
          {apps.map((app) => (
            <li key={app.id} className="flex justify-center">
              <button
                type="button"
                onClick={(e) => onOpen(app, e.currentTarget)}
                aria-haspopup="dialog"
                className="group flex w-full max-w-[112px] cursor-pointer flex-col items-center gap-2 rounded-2xl border-0 bg-transparent p-1 text-text sm:gap-3"
              >
                <span
                  className="block aspect-square w-[min(64px,100%)] overflow-hidden rounded-[22.5%] shadow-[0_1px_2px_rgb(0_0_0/0.12),0_4px_14px_rgb(0_0_0/0.08)] transition-transform duration-200 ease-out group-hover:scale-[1.04] group-active:scale-95 motion-reduce:transition-none sm:w-[88px]"
                  style={{ background: app.color }}
                >
                  <app.Icon />
                </span>
                <span className="max-w-full text-center text-[12px] leading-tight sm:text-[14px]">{app.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
