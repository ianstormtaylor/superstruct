import { struct } from '../../..'

const address = struct(
  {
    street: 'string',
    city: 'string',
  },
  {
    street: '123 fake st',
    city: 'springfield',
  }
)

export const Struct = struct.pick({
  name: 'string',
  address,
})

export const data = {
  name: 'Jane Smith',
  age: 42,
}

export const output = {
  name: 'Jane Smith',
  address: {
    street: '123 fake st',
    city: 'springfield',
  },
}
