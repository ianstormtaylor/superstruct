import { struct } from '../../..'

export const Struct = struct.tuple(['string', 'number'])

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: '[string,number]',
}
