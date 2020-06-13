import { map, string, number } from '../../..'

export const Struct = map(string(), number())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'map',
  refinement: undefined,
  path: [],
  branch: [data],
}
