
import s from '../../..'

export const struct = s([{ id: 'string' }])

export const value = [
  { id: '1' },
  'invalid',
  { id: '3' },
]

export const error = {
  code: 'value_invalid',
  type: 'object',
  path: [1],
  value: 'invalid',
}
