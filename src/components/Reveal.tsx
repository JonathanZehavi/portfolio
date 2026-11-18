import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type Props = {
  as?: ElementType
  className?: string
  children: ReactNode
  id?: string
  'aria-labelledby'?: string
}

/** Fades and lifts its content in the first time it scrolls into view. */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
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
