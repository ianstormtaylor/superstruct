import { struct } from '../../..'

export const Struct = struct.partial({
  name: 'string',
  age: 'number',
})

export const data = {
  name: 'john',
  age: 'invalid',
  email: 'john@example.com',
}

export const error = {
  path: ['age'],
  value: 'invalid',
  type: 'number',
  reason: null,
}
