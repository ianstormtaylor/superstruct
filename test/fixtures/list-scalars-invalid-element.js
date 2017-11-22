
import s from '../..'

export const struct = s(['number'])

export const value = [1, 'invalid', 3]

export const error = {
  code: 'element_invalid',
  index: 1,
  path: [1],
  value: 'invalid',
}
