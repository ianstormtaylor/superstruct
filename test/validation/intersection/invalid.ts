import { shape, intersection, string, number } from '../../..'

const A = shape({ a: string() })
const B = shape({ b: number() })

export const Struct = intersection([A, B])

export const data = {
  a: 'a',
  b: 'invalid',
}

export const error = {
  type: 'number',
  value: 'invalid',
  refinement: undefined,
  path: ['b'],
  branch: [data, data.b],
}
