import { enums } from '../../..'

export const Struct = enums([1, 2])

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'enums',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
