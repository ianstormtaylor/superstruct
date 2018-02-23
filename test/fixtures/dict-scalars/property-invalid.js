import { struct } from '../../..'

export const Struct = struct.dict(['string', 'number'])

export const data = { a: 'invalid' }

export const error = {
  path: ['a'],
  value: 'invalid',
  type: 'number',
}
