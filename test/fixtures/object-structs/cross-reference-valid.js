import { struct } from '../../../'

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
    city: 'London',
  },
}

export const output = {
  address: {
    country: 'UK',
    city: 'London',
  },
}
