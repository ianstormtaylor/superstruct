import { struct } from '../../../lib'

export const Struct = struct.array([{ id: 'string' }])

export const data = [{ id: '1' }, 'invalid', { id: '3' }]

export const error = {
  path: [1],
  value: 'invalid',
  type: '{id}',
}
