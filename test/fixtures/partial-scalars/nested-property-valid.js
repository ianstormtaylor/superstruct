
import { struct } from '../../..'

export const Struct = struct.partial({
  name: 'string',
  age: 'number',
  address: {
    street: 'string',
  }
})

export const data = {
  name: 'john',
  age: 42,
  address: {
    street: '123 fake st',
    city: 'springfield',
  }
}

export const output = {
  name: 'john',
  age: 42,
  address: {
    street: '123 fake st',
  }
}
