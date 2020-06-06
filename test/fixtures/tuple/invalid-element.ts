import { tuple, string, number } from '../../..'

export const Struct = tuple([string(), number()])

export const data = [false, 3]

export const error = {
  path: [0],
  value: false,
  type: 'string',
}
