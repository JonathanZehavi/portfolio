import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

type Props = {
  as?: ElementType
  className?: string
  children: ReactNode
  id?: string
  style?: CSSProperties
  'aria-labelledby'?: string
}

/** Fades and lifts its content in the first time it scrolls into view. */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  // Without IntersectionObserver (very old browsers), just show the content.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal ${className}`} data-visible={visible} {...rest}>
      {children}
    </Tag>
  )
}
