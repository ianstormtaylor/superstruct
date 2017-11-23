
import s from '../../..'

const address = s({
  street: 'string',
  city: 'string',
})

export const struct = s({
  address,
})

export const value = {
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
