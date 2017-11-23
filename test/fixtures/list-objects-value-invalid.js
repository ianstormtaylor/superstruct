
import s from '../..'

export const struct = s([{ id: 'string' }])

export const value = 'invalid'

export const error = {
  code: 'value_invalid',
  schema: '[{"id":"string"}]',
  path: [],
  value: 'invalid',
}
