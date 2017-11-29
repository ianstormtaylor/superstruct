
import { struct as s } from '../../..'

export const struct = s(['number'])

export const value = [1, 'invalid', 3]

export const error = {
  code: 'element_invalid',
  type: 'number',
  path: [1],
  index: 1,
  value: 'invalid',
}
