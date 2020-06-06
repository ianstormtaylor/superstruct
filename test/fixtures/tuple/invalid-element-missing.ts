import { tuple, string, number } from '../../..'

export const Struct = tuple([string(), number()])

export const data = ['A']

export const error = {
  path: [1],
  value: undefined,
  type: 'number',
}
