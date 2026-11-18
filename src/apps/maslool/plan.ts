/**
 * A pocket version of Maslool's planner (the real one is lib/optimize.ts in the app):
 * 1. sweep: sort stops by direction from the depot, give each driver a
 *    contiguous slice of roughly equal load, trying every starting direction;
 * 2. order each driver's stops by nearest neighbour, then improve with 2-opt;
 * 3. keep the split with the fewest total kilometres.
 */

export type Point = { lat: number; lng: number }

export type Stop = Point & {
  id: string
  name: string
  /** Pomegranate crates. */
  pom: number
  /** Juice bottles (12 to a crate). */
  juice: number
  /** Honey jars (12 to a crate). */
  honey: number
  /** Where the map label sits relative to the dot (default: right, or left near the edge). */
  label?: 'left' | 'right' | 'above'
}

export type DriverRoute = {
  stops: Stop[]
  crates: number
  km: number
}

const ROAD_FACTOR = 1.3

export const cratesOf = (s: Stop) => s.pom + s.juice / 12 + s.honey / 12

export function km(a: Point, b: Point): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h)) * ROAD_FACTOR
}

function pathKm(origin: Point, stops: Stop[]): number {
  let total = 0
  let prev: Point = origin
  for (const s of stops) {
    total += km(prev, s)
    prev = s
  }
  return total
}

function orderStops(origin: Point, stops: Stop[]): Stop[] {
  // Nearest neighbour from the depot.
  const left = [...stops]
  const route: Stop[] = []
  let at: Point = origin
  while (left.length) {
    let best = 0
    for (let i = 1; i < left.length; i++) if (km(at, left[i]) < km(at, left[best])) best = i
    at = left[best]
    route.push(left.splice(best, 1)[0])
  }
  // 2-opt on an open path that starts at the depot.
  let improved = true
  while (improved) {
    improved = false
    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 1; j < route.length; j++) {
        const candidate = [...route.slice(0, i), ...route.slice(i, j + 1).reverse(), ...route.slice(j + 1)]
        if (pathKm(origin, candidate) + 1e-9 < pathKm(origin, route)) {
          route.splice(0, route.length, ...candidate)
          improved = true
        }
      }
    }
  }
  return route
}

export function planRoutes(origin: Point, stops: Stop[], drivers: number, capacity: number): DriverRoute[] {
  const bearing = (s: Point) =>
    Math.atan2(s.lat - origin.lat, (s.lng - origin.lng) * Math.cos((origin.lat * Math.PI) / 180))
  const sorted = [...stops].sort((a, b) => bearing(a) - bearing(b))
  const total = stops.reduce((a, s) => a + cratesOf(s), 0)

  let best: DriverRoute[] | null = null
  let bestKm = Infinity

  for (let start = 0; start < sorted.length; start++) {
    const ring = [...sorted.slice(start), ...sorted.slice(0, start)]
    const groups: Stop[][] = Array.from({ length: drivers }, () => [])
    let cumulative = 0
    let d = 0
    for (const s of ring) {
      const c = cratesOf(s)
      // Move on to the next driver once this one has its share.
      const boundary = (total * (d + 1)) / drivers
      if (d < drivers - 1 && cumulative + c / 2 > boundary) d++
      groups[d].push(s)
      cumulative += c
    }
    const routes = groups.map((g) => {
      const ordered = orderStops(origin, g)
      return { stops: ordered, crates: g.reduce((a, s) => a + cratesOf(s), 0), km: pathKm(origin, ordered) }
    })
    if (routes.some((r) => r.crates > capacity || r.stops.length === 0)) continue
    const totalKm = routes.reduce((a, r) => a + r.km, 0)
    if (totalKm < bestKm) {
      bestKm = totalKm
      best = routes
    }
  }

  return best ?? []
}
