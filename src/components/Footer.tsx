const links = [
  { label: 'GitHub', href: 'https://github.com/JonathanZehavi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonathan-zehavi' },
]

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 pb-12 text-[14px] text-text-2">
      <p className="m-0">Jonathan Zehavi</p>
      <ul className="m-0 flex list-none gap-6 p-0">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-text underline-offset-4 hover:underline">
              {l.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
