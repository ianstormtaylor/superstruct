import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number',
  address: {
    street: 'string?',
    city: 'string',
  },
})

export const data = {
  name: 'john',
  age: 42,
  address: {
    city: 'springfield',
  },
}

export const output = {
  name: 'john',
  age: 42,
  address: {
    city: 'springfield',
  },
}
