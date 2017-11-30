
import { struct } from '../../..'

export const Struct = struct([{ id: 'string' }])

export const data = [
  { id: '1' },
  'invalid',
  { id: '3' },
]

export const error = {
  code: 'element_invalid',
  type: 'object',
  path: [1],
  index: 1,
  value: 'invalid',
}
