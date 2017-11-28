
import { struct as s } from '../../..'

const address = s({
  street: 'string?',
  city: 'string',
})

export const struct = s({
  address,
})

export const value = {
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
