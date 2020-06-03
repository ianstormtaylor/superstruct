import { map, string, number } from '../../..'

export const Struct = map([string(), number()])

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'Map<string,number>',
}
