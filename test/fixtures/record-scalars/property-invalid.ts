import { struct } from '../../..'

export const Struct = struct.record(['string', 'number'])

export const data = { a: 'invalid' }

export const error = {
  path: ['a'],
  value: 'invalid',
  type: 'number',
}
