# Jonathan Zehavi · Portfolio

A one-page portfolio of the apps I've built. Each app opens in a full-screen window that tells its story as you scroll (a pinned phone whose screen follows the chapters), then ends with a small interactive demo running on sample data.

**Live:** https://jonathan-zehavi-portfolio.vercel.app

| App | What it does | Demo |
|---|---|---|
| **Maslool** | Plans delivery routes for a family pomegranate-juice business, starting from its order spreadsheet | Split 11 stops between 2 or 3 drivers by direction and van capacity, then order each route (sweep, nearest neighbour and 2-opt) |
| **Telem** | Personal finance: checking and credit cards together, savings goals, loans | "Safe to spend" for this month, and "Can I afford it?" with instalments |
| **Mixed World** | A personal cocktail library | Mark bottles on your shelf, then see what you can make |
| **Kalo** | Calorie and workout tracker fed by an iOS Shortcut | Simulates the Shortcut's POST to the import endpoint and updates the day's numbers |

## Stack

React 19, TypeScript (strict), Vite and Tailwind CSS v4. No backend and no UI library.

- **Fast to load.** Each demo is lazy-loaded the first time its window opens, so the first page load is just the page. On Apple devices the system font is used, so no webfont is downloaded; other devices get Inter.
- **Accessible.** The window is a native `<dialog>` with a Tab trap. Esc and a click outside close it, and focus goes back to the icon that opened it. It respects `prefers-reduced-motion` and follows the system light/dark setting.
- **Phone first.** On a phone the window is a bottom sheet you can drag down to close; on desktop it's a centred window.
- Lighthouse on mobile: 100 in Performance, Accessibility, Best Practices and SEO.

## Structure

```
src/
  data/apps.ts        One entry per app: name, copy, icon, colour, links, tech, demo
  apps/<app>/         Icon.tsx, Story.tsx (scroll story), Demo.tsx, and their logic and styles
  components/         Hero, Showcase (the self-playing phone in the hero), AppCards, About, AppSheet (the window), Footer, Reveal
  components/story/   ScrollStory (pinned phone + chapters), Phone, CountUp
scripts/              Renders the Open Graph image and the touch icon
```

### Adding an app

1. Create `src/apps/<id>/Icon.tsx`, `Story.tsx` and `Demo.tsx` (Story and Demo with a default export). A story is a list of chapters plus one `Screen({ active })` that shows a layer per chapter.
2. Add an entry to `src/data/apps.ts` with `Story: lazy(() => import('../apps/<id>/Story'))` and `Demo: lazy(() => import('../apps/<id>/Demo'))`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build to dist/
npm run preview    # serve the build
```

`VITE_SITE_URL` in `.env` sets the absolute URLs in the Open Graph and canonical tags. Change it if the site moves to another domain.

To regenerate `public/og.png` and `public/apple-touch-icon.png`, run `npm run images` (needs Playwright with Chromium).
