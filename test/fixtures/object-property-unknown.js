
import s from '../..'

export const struct = s({
  name: 'string',
  age: 'number'
})

export const value = {
  name: 'john',
  age: 42,
  unknown: true,
}

export const error = {
  code: 'property_unknown',
  path: ['unknown'],
  key: 'unknown',
}
