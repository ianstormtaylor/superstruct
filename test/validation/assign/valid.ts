import { object, assign, string, number } from '../../..'

const A = object({ a: string() })
const B = object({ a: number(), b: number() })

export const Struct = assign(A, B)

export const data = {
  a: 1,
  b: 2,
}

export const output = {
  a: 1,
  b: 2,
}
