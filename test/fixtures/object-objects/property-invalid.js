
import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
  }
})

export const data = {
  name: 'john',
  age: 42,
  address: 'invalid',
}

export const error = {
  code: 'property_invalid',
  type: 'object',
  path: ['address'],
  key: 'address',
  value: 'invalid',
}
