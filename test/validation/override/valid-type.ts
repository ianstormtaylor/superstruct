import { type, override, string, number } from '../../../src'

const Target = type({ a: string() })

export const Struct = override(Target, { b: number() })

export const data = {
  a: '1',
  b: 2,
  c: 3,
}

export const output = {
  a: '1',
  b: 2,
  c: 3,
}
