import { string, coercion } from '../../..'

export const Struct = coercion(string(), (x) => (x == null ? 'unknown' : x))

export const data = 'known'

export const output = 'known'

export const coerce = true
