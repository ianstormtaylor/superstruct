
import { struct } from '../../..'

export const Struct = struct([{ id: 'string' }])

export const data = [
  { id: '1' },
  { id: false },
  { id: '3' },
]

export const error = {
  code: 'property_invalid',
  type: 'string',
  path: [1, 'id'],
  key: 'id',
  value: false,
}
