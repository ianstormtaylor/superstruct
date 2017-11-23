
import s from '../../..'

export const struct = s({
  name: 'string',
  age: 'number'
})

export const value = 'invalid'

export const error = {
  code: 'value_invalid',
  type: 'object',
  path: [],
  value: 'invalid',
}
