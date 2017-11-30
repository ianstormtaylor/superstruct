
import { struct } from '../../..'

export const Struct = struct(['number'])

export const data = [1, 'invalid', 3]

export const error = {
  code: 'element_invalid',
  type: 'number',
  path: [1],
  index: 1,
  value: 'invalid',
}
