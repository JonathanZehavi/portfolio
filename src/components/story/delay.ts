import type { CSSProperties } from 'react'

/** Shorthand for a staggered item's delay (read by the .st classes). */
export const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties
