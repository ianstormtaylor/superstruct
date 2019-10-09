import { struct } from '../../..'

export const Struct = struct(['string', 'number'])

export const data = 'invalid'

export const error = {
  type: '[string,number]',
  value: 'invalid',
  path: [],
}
