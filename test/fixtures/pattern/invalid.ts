import { string, pattern } from '../../..'

export const Struct = pattern(string(), /\d+/)

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'string & Pattern<\\d+>',
}
