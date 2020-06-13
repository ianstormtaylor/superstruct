import { shape, intersection, string, number } from '../../..'

const A = shape({ a: string() })
const B = shape({ b: number() })

export const Struct = intersection([A, B])

export const data = {
  a: 'a',
  b: 42,
}

export const output = {
  a: 'a',
  b: 42,
}
