import { struct } from '../../..'

export const Struct = struct.enum([1, 2])

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: '1 | 2',
}
