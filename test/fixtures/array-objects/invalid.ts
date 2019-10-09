import { struct } from '../../..'

export const Struct = struct.array([{ id: 'string' }])

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: '{id}[]',
}
