import { map, string, number } from '../../..'

export const Struct = map(string(), number())

export const data = new Map([
  ['a', 'a'],
  ['b', 'b'],
])

export const error = {
  path: ['a'],
  value: 'a',
  type: 'number',
}
