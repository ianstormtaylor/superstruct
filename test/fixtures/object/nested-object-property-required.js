
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
}

export const error = {
  code: 'property_required',
  type: 'object',
  path: ['address'],
  key: 'address',
}
