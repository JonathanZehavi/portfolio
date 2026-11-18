import type { Point, Stop } from './plan'

/** The loading point every route starts from. */
export const DEPOT: Point & { name: string } = { name: 'Merav', lat: 32.4519, lng: 35.423 }

/** Van capacity in crate-equivalents. */
export const CAPACITY = 100

/** Real places in the Jordan Valley; the quantities are made up. */
export const STOPS: Stop[] = [
  { id: 'yavneel', name: 'Yavne’el', label: 'left', lat: 32.7069, lng: 35.5028, pom: 16, juice: 6, honey: 2 },
  { id: 'afikim', name: 'Afikim', label: 'above', lat: 32.6817, lng: 35.5806, pom: 8, juice: 12, honey: 1 },
  { id: 'gesher', name: 'Gesher', lat: 32.6289, lng: 35.5533, pom: 15, juice: 2, honey: 4 },
  { id: 'neve-or', name: 'Neve Or', lat: 32.5117, lng: 35.5333, pom: 7, juice: 4, honey: 0 },
  { id: 'hamadia', name: 'Hamadia', lat: 32.4747, lng: 35.5231, pom: 9, juice: 3, honey: 2 },
  { id: 'mehola', name: 'Mehola', lat: 32.3247, lng: 35.5253, pom: 28, juice: 12, honey: 3 },
  { id: 'hemdat', name: 'Hemdat', lat: 32.2661, lng: 35.5194, pom: 22, juice: 8, honey: 3 },
  { id: 'rotem', name: 'Rotem', label: 'left', lat: 32.2456, lng: 35.4808, pom: 26, juice: 2, honey: 0 },
  { id: 'hamra', name: 'Hamra', lat: 32.13, lng: 35.4308, pom: 8, juice: 0, honey: 0 },
  { id: 'mekhora', name: 'Mekhora', lat: 32.1717, lng: 35.4083, pom: 5, juice: 6, honey: 0 },
  { id: 'gitit', name: 'Gitit', lat: 32.0764, lng: 35.3925, pom: 18, juice: 3, honey: 1 },
]
