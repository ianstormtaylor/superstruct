import { shape, union, string, number } from '../../..'

const A = shape({ a: string() })
const B = shape({ b: number() })

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
]
