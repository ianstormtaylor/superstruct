import { struct } from '../../..'

const address = struct.object({
  street: 'string',
  city: 'string',
})

export const Struct = struct.object(
  {
    address,
  },
  {
    address: {
      street: '123 fake st',
      city: 'springfield',
    },
  }
)

export const data = undefined

export const output = {
  address: {
    street: '123 fake st',
    city: 'springfield',
  },
}
