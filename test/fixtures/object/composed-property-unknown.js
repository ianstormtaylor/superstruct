
import s from '../../..'

const address = s({
  street: 'string',
  city: 'string',
})

export const struct = s({
  name: 'string',
  age: 'number',
  address,
})

export const value = {
  name: 'john',
  age: 42,
  address: {
    street: '123 fake st',
    city: 'springfield',
    state: 'unknown',
  }
}

export const error = {
  code: 'property_unknown',
  path: ['address', 'state'],
  key: 'state',
}
