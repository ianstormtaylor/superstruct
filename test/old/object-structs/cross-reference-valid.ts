import { struct, Branch } from '../../../'

const Address = struct.object({
  country: 'string',
  city: (value: any, branch: Branch) => {
    const parent = branch[branch.length - 2]
    return parent.country === 'UK' && value === 'London'
  },
})

export const Struct = struct.object({
  address: Address,
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
