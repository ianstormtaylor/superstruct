import { struct } from '../../..'

const address = struct.object({
  street: 'string',
  city: 'string',
})

export const Struct = struct.object(
  {
    name: 'string',
    address,
  },
  {
    address: {
      street: '123 fake st',
      city: 'springfield',
    },
  }
)

export const data = {
  name: 'Jane Smith',
}

export const output = {
  name: 'Jane Smith',
  address: {
    street: '123 fake st',
    city: 'springfield',
  },
}
