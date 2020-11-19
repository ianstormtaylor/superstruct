import { type, intersection, string, number } from '../../..'

const A = type({ a: string() })
const B = type({ b: number() })

export const Struct = intersection([A, B])

export const data = {
  a: 'a',
  b: 'invalid',
}

export const failures = [
  {
    type: 'number',
    value: 'invalid',
    path: ['b'],
    branch: [data, data.b],
  },
]
