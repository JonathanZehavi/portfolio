import { Suspense, useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { AppInfo } from '../data/apps'

type Props = {
  app: AppInfo | null
  onClosed: () => void
}

const CLOSE_MS = 360
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * One window for every app. A native <dialog> opened with showModal(), so the
 * page behind is inert and Esc works; on top of that a Tab trap, an animated
 * close, click-outside, and drag-down-to-dismiss on the phone sheet.
 */
export function AppSheet({ app, onClosed }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'closed' | 'open'>('closed')
  const closing = useRef(false)
  const drag = useRef<{ startY: number; dy: number } | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!app || !dialog) return
    closing.current = false
    if (!dialog.open) dialog.showModal()
    panelRef.current?.focus({ preventScroll: true })
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setState('open')))
    return () => cancelAnimationFrame(id)
  }, [app])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    setState('closed')
    const panel = panelRef.current
    if (panel) panel.style.transform = ''
    window.setTimeout(
      () => {
        dialogRef.current?.close()
        onClosed()
      },
      reducedMotion() ? 160 : CLOSE_MS,
    )
  }, [onClosed])

  // Esc fires "cancel" on a modal dialog: run the animated close instead.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      close()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => dialog.removeEventListener('cancel', onCancel)
  }, [close])

  const trapTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !panelRef.current) return
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    )
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // Drag the grabber down to dismiss (phone sheet only).
  const onDragStart = (e: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(min-width: 768px)').matches) return
    drag.current = { startY: e.clientY, dy: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
    if (panelRef.current) panelRef.current.style.transition = 'none'
  }
  const onDragMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !panelRef.current) return
    const dy = Math.max(0, e.clientY - drag.current.startY)
    drag.current.dy = dy
    panelRef.current.style.transform = `translateY(${dy}px)`
  }
  const onDragEnd = () => {
    const d = drag.current
    drag.current = null
    const panel = panelRef.current
    if (!d || !panel) return
    panel.style.transition = ''
    if (d.dy > 110) {
      panel.style.transform = ''
      close()
    } else {
      panel.style.transform = ''
    }
  }

  const titleId = app ? `${app.id}-title` : undefined

  return (
    <dialog ref={dialogRef} className="app-sheet" data-state={state} aria-labelledby={titleId}>
      <div className="app-sheet__scrim" onClick={close} aria-hidden="true" />
      {app && (
        <div
          ref={panelRef}
          className="app-sheet__panel outline-none"
          tabIndex={-1}
          onKeyDown={trapTab}
          role="document"
        >
          {/* Grabber: visual on phones, also a drag target. */}
          <div
            className="flex shrink-0 touch-none justify-center pt-2 pb-1 md:hidden"
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
            aria-hidden="true"
          >
            <span className="h-[5px] w-9 rounded-full bg-line" />
          </div>

          <div className="flex shrink-0 items-center gap-3 border-b border-line px-5 pt-1 pb-3 sm:px-6 sm:py-3">
            <span
              className="block size-8 shrink-0 overflow-hidden rounded-[22.5%]"
              style={{ background: app.color }}
            >
              <app.Icon />
            </span>
            <h2 id={titleId} className="m-0 min-w-0 flex-1 text-[17px] font-semibold tracking-[-0.01em]">
              {app.name}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={`Close ${app.name}`}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-well text-text-2 hover:text-text"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="app-sheet__scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10 sm:px-10">
            {/* Opening */}
            <header className="mx-auto max-w-[760px] pt-6 pb-10 text-center sm:pt-14 sm:pb-16">
              <span
                className="mx-auto block size-20 overflow-hidden rounded-[22.5%] shadow-[0_2px_4px_rgb(0_0_0/0.12),0_10px_30px_rgb(0_0_0/0.12)] sm:size-24"
                style={{ background: app.color }}
                aria-hidden="true"
              >
                <app.Icon />
              </span>
              <p className="mt-6 mb-0 text-[clamp(2rem,6vw,3.75rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance">
                {app.headline}
              </p>
              <p className="mx-auto mt-5 mb-0 max-w-[58ch] text-[17px] leading-[1.5] text-text-2 sm:text-[19px]">{app.what}</p>
              <p className="mx-auto mt-3 mb-0 max-w-[58ch] text-[15px] leading-[1.5] text-text-2">
                <span className="text-text">The problem: </span>
                {app.problem}
              </p>
              {app.outcome && (
                <dl className="mx-auto mt-8 mb-0 flex max-w-[520px] justify-center gap-10">
                  {app.outcome.map((o) => (
                    <div key={o.label}>
                      <dt className="sr-only">{o.label}</dt>
                      <dd className="m-0 text-[28px] font-semibold tracking-[-0.02em] tabular-nums sm:text-[34px]">{o.value}</dd>
                      <dd className="m-0 text-[13px] text-text-2">{o.label}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p className="mt-10 mb-0 text-[13px] text-text-2" aria-hidden="true">
                Scroll to see how it works ↓
              </p>
            </header>

            {app.Story && (
              <section aria-label={`How ${app.name} works`} className="mx-auto max-w-[1040px]">
                <Suspense fallback={<div className="h-[60dvh] animate-pulse rounded-[28px] bg-well" />}>
                  <app.Story />
                </Suspense>
              </section>
            )}

            <section aria-labelledby={`${app.id}-try`} className="mx-auto mt-16 max-w-[760px] sm:mt-24">
              <div className="mb-4 text-center">
                <h3 id={`${app.id}-try`} className="m-0 text-[28px] font-semibold tracking-[-0.02em] sm:text-[34px]">
                  Try it yourself
                </h3>
                <p className="mt-1 mb-0 text-[14px] text-text-2">A simplified version with sample data, running in your browser.</p>
              </div>
              {app.Demo ? (
                <Suspense fallback={<div className="h-[420px] animate-pulse rounded-2xl bg-well" />}>
                  <app.Demo />
                </Suspense>
              ) : null}

              {app.note && <p className="mt-6 mb-0 text-[14px] leading-[1.5] text-text-2">{app.note}</p>}

              <ul className="mt-5 mb-0 flex list-none flex-wrap gap-1.5 p-0" aria-label="Technologies">
                {app.tech.map((t) => (
                  <li key={t} className="rounded-full border border-line px-2.5 py-1 text-[12px] leading-none text-text-2">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {(app.url || app.repo) && (
            <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-8 sm:py-4">
              {app.url && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-text px-5 py-2.5 text-[15px] font-medium text-bg no-underline hover:opacity-85"
                >
                  Open app
                  <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                    <path d="M3.5 2.5h6v6M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              {app.repo && (
                <a
                  href={app.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-[15px] font-medium text-text no-underline hover:bg-well"
                >
                  View code<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {app.signInRequired && <span className="text-[13px] text-text-2">Sign-in required</span>}
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
