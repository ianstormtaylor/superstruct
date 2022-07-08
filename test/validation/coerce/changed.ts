import { string, unknown, coerce } from '../../../src'

export const Struct = coerce(string(), unknown(), (x) =>
  x == null ? 'unknown' : x
)

export const data = null

export const output = 'unknown'

export const create = true
