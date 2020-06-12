import { type, union, string, number } from '../../..'

const A = type({ a: string() })
const B = type({ b: number() })

export const Struct = union([A, B])

export const data = {
  a: 'a',
}

export const output = {
  a: 'a',
}
