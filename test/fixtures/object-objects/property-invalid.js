import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
    city: 'string',
  },
})

export const data = {
  name: 'john',
  age: 42,
  address: 'invalid',
}

export const error = {
  path: ['address'],
  value: 'invalid',
  type: '{street,city}',
  reason: null,
}
