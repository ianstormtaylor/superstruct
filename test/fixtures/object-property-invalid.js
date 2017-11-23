
import s from '../..'

export const struct = s({
  name: 'string',
  age: 'number'
})

export const value = {
  name: 'john',
  age: 'invalid',
}

export const error = {
  code: 'property_invalid',
  type: 'number',
  path: ['age'],
  key: 'age',
  value: 'invalid',
}
