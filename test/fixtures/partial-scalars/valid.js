import { struct } from '../../..'

export const Struct = struct.partial({
  name: 'string',
  age: 'number',
})

export const data = {
  name: 'john',
  age: 42,
  email: 'john@example.com',
}

export const output = {
  name: 'john',
  age: 42,
}
