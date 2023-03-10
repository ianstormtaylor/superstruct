import { type, override, string, number } from '../../../src'

const Target = type({ a: string() })

export const Struct = override(Target, { a: number(), b: number() })

export const data = {
  a: 1,
  b: 2,
}

export const output = {
  a: 1,
  b: 2,
}
