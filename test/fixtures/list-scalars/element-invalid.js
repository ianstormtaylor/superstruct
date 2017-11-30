
import { struct } from '../../..'

export const Struct = struct(['number'])

export const data = [1, 'invalid', 3]

export const error = {
  path: [1],
  value: 'invalid',
  type: 'number',
}
