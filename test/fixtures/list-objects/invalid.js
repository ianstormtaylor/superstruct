import { struct } from '../../..'

export const Struct = struct([{ id: 'string' }])

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: '[{id}]',
  reason: null,
}
