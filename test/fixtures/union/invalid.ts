import { type, union, string, number } from '../../..'

const A = type({ a: string() })
const B = type({ b: number() })

export const Struct = union([A, B])

export const data = {
  b: 'invalid',
}

export const error = {
  path: [],
  type: 'Type<{a}> | Type<{b}>',
  value: { b: 'invalid' },
}
