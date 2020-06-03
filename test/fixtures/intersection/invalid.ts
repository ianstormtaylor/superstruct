import { type, intersection, string, number } from '../../..'

const A = type({ a: string() })
const B = type({ b: number() })

export const Struct = intersection([A, B])

export const data = {
  a: 'a',
  b: 'invalid',
}

export const error = {
  path: ['b'],
  type: 'number',
  value: 'invalid',
}
