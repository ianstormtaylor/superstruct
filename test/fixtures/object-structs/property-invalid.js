
import { struct } from '../../..'

const address = struct({
  street: 'string?',
  city: 'string',
})

export const Struct = struct({
  address,
})

export const data = {
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
