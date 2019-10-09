import { struct } from '../../..'

const address = struct.object({
  street: 'string',
  city: 'string',
})

export const Struct = struct.object({
  address,
})

export const data = {
  address: {
    city: 'springfield',
  },
}

export const error = {
  path: ['address', 'street'],
  value: undefined,
  type: 'string',
}
