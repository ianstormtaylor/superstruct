import { struct } from '../../..'

export const Struct = struct([{ id: 'string' }])

export const data = [{ id: '1' }, { id: false }, { id: '3' }]

export const error = {
  path: [1, 'id'],
  value: false,
  type: 'string',
  reason: null,
}
