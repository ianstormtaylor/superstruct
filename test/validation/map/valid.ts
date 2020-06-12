import { map, string, number } from '../../..'

export const Struct = map(string(), number())

export const data = new Map([
  ['a', 1],
  ['b', 2],
])

export const output = new Map([
  ['a', 1],
  ['b', 2],
])
