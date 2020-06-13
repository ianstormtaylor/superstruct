import { shape, union, string, number } from '../../..'

const A = shape({ a: string() })
const B = shape({ b: number() })

export const Struct = union([A, B])

export const data = {
  a: 'a',
}

export const output = {
  a: 'a',
}
