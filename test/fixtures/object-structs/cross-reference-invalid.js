import { struct } from '../../..'

const address = struct.object({
  country: 'string',
  city: (value, branch) => {
    const parent = branch[branch.length - 2]
    return parent.country === 'UK' && value === 'London'
  },
})

export const Struct = struct.object({
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
  type: 'function<…>',
}
