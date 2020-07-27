import { type, union, string, number } from '../../..'

const A = type({ a: string() })
const B = type({ b: number() })

export const Struct = union([A, B])

export const data = {
  b: 'invalid',
}

export const failures = [
  {
    type: 'Type<{a}> | Type<{b}>',
    value: { b: 'invalid' },
    path: [],
    branch: [data],
  },
]
