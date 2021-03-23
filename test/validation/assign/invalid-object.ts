import { object, assign, string, number } from '../../../lib'

const A = object({ a: string() })
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
  {
    branch: [data, data.c],
    path: ['c'],
    refinement: undefined,
    type: 'never',
    value: 5,
  },
]
