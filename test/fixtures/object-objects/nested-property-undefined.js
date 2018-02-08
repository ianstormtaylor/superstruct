
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
  address: {
    street: '123 fake st',
    city: 'springfield',
    country: undefined,
  }
}

export const output = {
  name: 'john',
  age: 42,
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
}
