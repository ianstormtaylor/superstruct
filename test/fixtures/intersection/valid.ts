import { type, intersection, string, number } from '../../..'

const A = type({ a: string() })
const B = type({ b: number() })

export const Struct = intersection([A, B])

export const data = {
  a: 'a',
  b: 42,
}

export const output = {
  a: 'a',
  b: 42,
}
