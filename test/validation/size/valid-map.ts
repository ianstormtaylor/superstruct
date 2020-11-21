import { string, number, map, size } from '../../..'

export const Struct = size(map(number(), string()), 1, 5)

export const data = new Map([
  [1, 'a'],
  [2, 'b'],
  [3, 'c'],
])

export const output = data
