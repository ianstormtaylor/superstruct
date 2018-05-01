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
    street: '123 fake st',
    city: 'springfield',
    state: 'unknown',
  },
}

export const error = {
  path: ['address', 'state'],
  value: 'unknown',
  type: undefined,
  reason: null,
}
