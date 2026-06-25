import { coerce, number, set, string } from '../../../src'

const toNumber = coerce(number(), string(), (v) => parseFloat(v))

export const Struct = set(toNumber)

export const data = new Set(['1', '2'])

export const output = new Set([1, 2])

export const create = true
