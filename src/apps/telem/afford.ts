/**
 * Ported from Telem's utils/financials.ts (projectWhatIf), trimmed to what the demo needs:
 * project the balance month by month with and without a purchase paid in instalments,
 * and find the earliest month it can start without the balance going negative.
 */
export function whatIf(startBalance: number, monthlySurplus: number, price: number, installments: number, horizon = 9) {
  const pay = installments > 0 ? price / installments : price
  const points: { month: number; baseline: number; withPurchase: number }[] = []
  let lowest = Infinity
  for (let m = 0; m <= horizon; m++) {
    const baseline = startBalance + monthlySurplus * m
    const withPurchase = baseline - Math.min(m, installments) * pay
    if (m > 0) lowest = Math.min(lowest, withPurchase)
    points.push({ month: m, baseline, withPurchase })
  }

  const affordableNow = lowest >= 0
  let waitMonths: number | null = affordableNow ? 0 : null
  if (!affordableNow) {
    for (let start = 1; start <= 24; start++) {
      let ok = true
      for (let k = 0; k <= installments; k++) {
        if (startBalance + monthlySurplus * (start + k) - Math.min(k, installments) * pay < 0) {
          ok = false
          break
        }
      }
      if (ok) {
        waitMonths = start
        break
      }
    }
  }
  return { points, affordableNow, waitMonths }
}

export const shekels = (n: number) => `${n < 0 ? '−' : ''}₪${Math.abs(Math.round(n)).toLocaleString('en-US')}`
