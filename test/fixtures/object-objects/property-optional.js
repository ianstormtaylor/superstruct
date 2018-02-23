import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number',
  address: struct.optional({
    street: 'string?',
    city: 'string?',
  }),
})

export const data = {
  name: 'john',
  age: 42,
}

export const output = {
  name: 'john',
  age: 42,
}
