import { number, nonnegative } from '../../..'

export const Struct = nonnegative(number())

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
