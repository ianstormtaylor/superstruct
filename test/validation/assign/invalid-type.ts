import { type, object, assign, string, number } from '../../../lib'

const A = type({ a: string() })
const B = object({ a: number(), b: number() })

export const Struct = assign(A, B)

export const data = {
  a: 'invalid',
  b: 2,
  c: 5,
}

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    refinement: undefined,
    path: ['a'],
    branch: [data, data.a],
  },
]
