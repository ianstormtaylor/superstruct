import { object, assign, string, number } from '../../..'

const A = object({ a: string() })
const B = object({ a: number(), b: number() })

export const Struct = assign([A, B])

export const data = {
  a: 'invalid',
  b: 2,
}

export const error = {
  type: 'number',
  value: 'invalid',
  path: ['a'],
  branch: [data, data.a],
}
