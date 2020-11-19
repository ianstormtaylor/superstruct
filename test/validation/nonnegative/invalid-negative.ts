import { number, nonnegative } from '../../..'

export const Struct = nonnegative(number())

export const data = -1

export const failures = [
  {
    value: -1,
    type: 'number',
    refinement: 'nonnegative',
    path: [],
    branch: [data],
  },
]
