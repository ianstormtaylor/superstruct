import { type, object, assign, string, number } from '../../..'

const A = type({ a: string() })
const B = object({ b: number() })

export const Struct = assign(A, B)

export const data = {
  a: '1',
  b: 2,
  c: 3,
}

export const output = {
  a: '1',
  b: 2,
  c: 3,
}
