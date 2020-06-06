import { tuple, string, number } from '../../..'

export const Struct = tuple([string(), number()])

export const data = ['A', 3, 'unknown']

export const error = {
  path: [2],
  value: 'unknown',
  type: 'never',
}
