import { map, string, number } from '../../..'

export const Struct = map(string(), number())

export const data = new Map([
  ['a', 'a'],
  ['b', 'b'],
])

export const error = {
  value: 'a',
  type: 'number',
  refinement: undefined,
  path: ['a'],
  branch: [data, 'a'],
}
