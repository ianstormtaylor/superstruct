import { struct } from '../../..'

export const Struct = struct(['string', 'number'])

export const data = ['A', 3, 'unknown']

export const error = {
  path: [2],
  value: 'unknown',
  type: undefined,
  reason: null,
}
