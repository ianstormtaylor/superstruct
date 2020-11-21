import { integer } from '../../..'

export const Struct = integer()

export const data = 3.14

export const failures = [
  {
    value: 3.14,
    type: 'integer',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
