import { integer } from '../../..'

export const Struct = integer()

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'integer',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
