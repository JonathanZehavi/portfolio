export function Hero() {
  return (
    <header className="pt-20 pb-16 sm:pt-32 sm:pb-24">
      <h1 className="text-[clamp(3rem,10vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.035em]">
        Jonathan Zehavi
      </h1>
      <p className="mt-5 max-w-[18ch] text-[clamp(1.5rem,4.4vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-text-2 sm:max-w-[22ch]">
        I build tools that replace spreadsheets and paperwork.
      </p>
      <p className="mt-6 text-[15px] text-text-2 sm:text-[17px]">
        Full-stack developer <span aria-hidden="true">·</span>
        <span className="sr-only">,</span> AI &amp; automation builder
      </p>
    </header>
  )
}
