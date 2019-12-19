import { struct } from '../../..'

export const Struct = struct.record(['string', 'number'])

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'record<string,number>',
}
