import { string, unknown, coerce } from '../../../src'

export const Struct = coerce(string(), unknown(), (x) =>
  x == null ? 'unknown' : x
)

export const data = 'known'

export const output = 'known'

export const create = true
