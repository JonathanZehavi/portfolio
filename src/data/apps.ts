import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { MasloolIcon } from '../apps/maslool/Icon'
import { TelemIcon } from '../apps/telem/Icon'
import { MixedWorldIcon } from '../apps/mixed-world/Icon'
import { KaloIcon } from '../apps/kalo/Icon'

export type AppInfo = {
  /** URL-safe id, also used as the #hash that opens the window. */
  id: string
  name: string
  /** One sentence: what it does. */
  what: string
  /** One sentence: what problem it solves. */
  problem: string
  /** Optional before/after figures shown as a small stat row. */
  outcome?: { value: string; label: string }[]
  /** Optional honest caveat shown under the description. */
  note?: string
  tech: string[]
  /** Background of the icon tile. */
  color: string
  Icon: ComponentType
  url?: string
  repo?: string
  signInRequired?: boolean
  /** Loaded on first open, so the page itself stays small. */
  Demo?: LazyExoticComponent<ComponentType>
}

export const apps: AppInfo[] = [
  {
    id: 'maslool',
    name: 'Maslool',
    what: 'Takes the order spreadsheet, splits the stops between drivers by van capacity and direction, and gives each driver an ordered route with Waze links and a packing list.',
    problem:
      'A family pomegranate-juice business planned every delivery day by hand, the evening before, from an Excel export of its order site.',
    outcome: [
      { value: '~3 h → min', label: 'planning per delivery day' },
      { value: '4', label: 'drivers routed by the app' },
    ],
    tech: ['React', 'TypeScript', 'Supabase', 'Postgres RLS', 'Realtime', 'SheetJS', 'Tailwind'],
    color: '#1F2430',
    Icon: MasloolIcon,
    url: 'https://maslool-app.vercel.app',
    signInRequired: true,
    Demo: lazy(() => import('../apps/maslool/Demo')),
  },
  {
    id: 'telem',
    name: 'Telem',
    what: 'Personal finance in one view: checking balance and upcoming credit card charges together, what you can safely spend, savings for planned purchases, and loan tracking.',
    problem:
      'Bank and card apps show their numbers separately, so “can I afford this?” takes mental math every time.',
    note: 'Includes Talma, an AI agent that searches for the lowest price of a product. The bank connection is simulated for now.',
    tech: ['React', 'TypeScript', 'Supabase', 'Node.js', 'Gemini API', 'Chart.js', 'Tailwind'],
    color: '#0F6E56',
    Icon: TelemIcon,
    url: 'https://telem-app.vercel.app',
  },
  {
    id: 'mixed-world',
    name: 'Mixed World',
    what: 'A personal cocktail library of recipes, bottles, brands, glassware and homemade syrups, with a small community to share recipes.',
    problem:
      'Recipes live in bookmarks and notes, and none of them know which bottles are actually on your shelf.',
    tech: ['React 19', 'TypeScript', 'React Router', 'Supabase', 'Realtime', 'Tailwind'],
    color: '#0B0F14',
    Icon: MixedWorldIcon,
    url: 'https://mixedworld.vercel.app',
    signInRequired: true,
  },
  {
    id: 'kalo',
    name: 'Kalo',
    what: 'A calorie and workout tracker that imports steps, active calories and exercise minutes from iPhone Health by itself.',
    problem:
      'Typing in activity by hand is the step everyone skips. An iOS Shortcut posts it to the app’s endpoint instead.',
    tech: ['React 19', 'TypeScript', 'Vercel Functions', 'Supabase', 'iOS Shortcuts', 'Web Push'],
    color: '#1C1B18',
    Icon: KaloIcon,
    url: 'https://kalo-app-theta.vercel.app',
  },
]
