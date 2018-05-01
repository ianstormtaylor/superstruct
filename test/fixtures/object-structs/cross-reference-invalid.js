import { struct } from '../../..'

const address = struct({
  country: 'string',
  city: (value, data) => !!(data.country === 'UK' && value === 'London'),
})

export const Struct = struct({
  address,
})

export const data = {
  address: {
    country: 'UK',
    city: 'Manchester',
  },
}

export const error = {
  path: ['address', 'city'],
  value: 'Manchester',
  type: '<function>',
  reason: null,
}
