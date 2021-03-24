import { type, assign, string, number } from '../../..'

const A = type({ a: string() })
const B = type({ a: number(), b: number() })

export const Struct = assign(A, B)

export const data = {
  a: 1,
  b: 2,
}

export const output = {
  a: 1,
  b: 2,
}
