import { union, string, number, defaulted, object } from '../../../src'

const A = string()
const B = object({ a: number(), b: defaulted(number(), 5) })

export const Struct = union([A, B])

export const data = { a: 5 }

export const output = { a: 5, b: 5 }

export const create = true
