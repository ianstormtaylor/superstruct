
import s from '../../..'

export const struct = s({
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
  }
})

export const value = {
  name: 'john',
  age: 42,
  address: {
    street: false,
    city: 'springfield',
  }
}

export const error = {
  code: 'property_invalid',
  type: 'string',
  path: ['address', 'street'],
  key: 'street',
  value: false,
}
