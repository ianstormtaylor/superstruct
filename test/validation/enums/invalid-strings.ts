import { enums } from '../../..'

export const Struct = enums(['one', 'two'])

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
