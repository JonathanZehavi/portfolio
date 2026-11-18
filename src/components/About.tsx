import { Reveal } from './Reveal'

const rows = [
  {
    label: 'Before',
    text: 'Eight years as an aircraft maintenance team lead in the Israeli Air Force, working with complex systems and safety-critical processes.',
  },
  { label: 'Trained', text: 'Graduated a 655-hour Full Stack Java program.' },
  {
    label: 'Now',
    text: 'Building internal tools on an R&D team that replaced Excel sheets and paper records, and coaching colleagues on working with Copilot.',
  },
  { label: 'Studying', text: 'Second-year B.A. in Public Policy (Government and Law).' },
]

export function About() {
  return (
    <Reveal as="section" aria-labelledby="about-title" className="border-t border-line py-14 sm:py-20">
      <h2 id="about-title" className="text-[13px] font-semibold tracking-[0.06em] text-text-2 uppercase">
        About
      </h2>
      <dl className="mt-8 grid gap-7 sm:gap-8">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-8">
            <dt className="text-[15px] text-text-2 sm:pt-[3px]">{r.label}</dt>
            <dd className="m-0 max-w-[46ch] text-[19px] leading-[1.45] tracking-[-0.01em] sm:text-[21px]">{r.text}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
