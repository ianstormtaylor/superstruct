import { type, union, string, number } from '../../..'

const A = type({ a: string() })
const B = type({ b: number() })

export const Struct = union([A, B])

export const data = {
  b: 'invalid',
}

export const failures = [
  {
    value: { b: 'invalid' },
    type: 'union',
    refinement: undefined,
    path: [],
    branch: [data],
  },
  {
    value: undefined,
    type: 'string',
    refinement: undefined,
    path: ['a'],
    branch: [data, undefined],
  },
  {
    value: 'invalid',
    type: 'number',
    refinement: undefined,
    path: ['b'],
    branch: [data, data.b],
  },
]
