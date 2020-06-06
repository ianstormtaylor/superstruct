import { tuple, string, number } from '../../..'

export const Struct = tuple([string(), number()])

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: '[string,number]',
}
