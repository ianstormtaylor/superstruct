import { string, coercion } from '../../..'

export const Struct = coercion(string(), (x) => (x == null ? 'unknown' : x))

export const data = null

export const output = 'unknown'

export const coerce = true
