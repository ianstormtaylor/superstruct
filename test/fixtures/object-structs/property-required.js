import { struct } from '../../..'

const address = struct({
  street: 'string',
  city: 'string',
})

export const Struct = struct({
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
  reason: null,
}
