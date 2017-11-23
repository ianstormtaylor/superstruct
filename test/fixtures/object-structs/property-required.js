
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
    city: 'springfield',
  }
}

export const error = {
  code: 'property_required',
  type: 'string',
  path: ['address', 'street'],
  key: 'street',
}
