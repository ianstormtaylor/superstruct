import { union, string, number, defaulted } from '../../..'

const A = defaulted(string(), 'foo')
const B = number()

export const Struct = union([A, B])

export const data = undefined

export const output = 'foo'

export const create = true
