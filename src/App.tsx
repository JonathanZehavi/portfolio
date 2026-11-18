import { useCallback, useEffect, useRef, useState } from 'react'
import { apps, type AppInfo } from './data/apps'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { AppGrid } from './components/AppGrid'
import { AppSheet } from './components/AppSheet'
import { Footer } from './components/Footer'

const fromHash = () => apps.find((a) => `#${a.id}` === window.location.hash) ?? null

export default function App() {
  const [open, setOpen] = useState<AppInfo | null>(() => (typeof window === 'undefined' ? null : fromHash()))
  const trigger = useRef<HTMLElement | null>(null)

  const openApp = (app: AppInfo, el: HTMLElement) => {
    trigger.current = el
    setOpen(app)
    history.replaceState(null, '', `#${app.id}`)
  }

  const onClosed = useCallback(() => {
    setOpen(null)
    history.replaceState(null, '', window.location.pathname + window.location.search)
    trigger.current?.focus()
  }, [])

  // A shared link like /#maslool opens that app's window.
  useEffect(() => {
    const onHash = () => setOpen(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="mx-auto max-w-[980px] px-4 sm:px-8">
      <main>
        <Hero />
        <About />
        <AppGrid apps={apps} onOpen={openApp} />
      </main>
      <Footer />
      <AppSheet app={open} onClosed={onClosed} />
    </div>
  )
}
