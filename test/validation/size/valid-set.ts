import { number, set, size } from '../../..'

export const Struct = size(set(number()), 1, 5)

export const data = new Set([1, 2, 3])

export const output = data
