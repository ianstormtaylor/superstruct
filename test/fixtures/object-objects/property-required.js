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
}

export const error = {
  path: ['address'],
  value: undefined,
  type: '{street,city}',
  reason: null,
}
