
import s from '../..'

export const struct = s([{ id: 'string!' }])

export const value = [
  { id: '1' },
  'invalid',
  { id: '3' },
]

export const error = {
  code: 'element_invalid',
  index: 1,
  path: [1],
  value: 'invalid',
}
