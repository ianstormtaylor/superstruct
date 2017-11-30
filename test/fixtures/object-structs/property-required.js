
import { struct } from '../../..'

const address = struct({
  street: 'string',
  city: 'string',
})

export const Struct = struct({
  address,
})

export const data = {
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
