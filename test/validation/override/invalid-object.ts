import { object, override, string, number } from '../../../src'

const Target = object({ a: string() })

export const Struct = override(Target, { a: number(), b: number() })

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
