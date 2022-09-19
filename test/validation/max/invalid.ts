import { number, max } from '../../../src'

export const Struct = max(number(), 0)

export const data = 1

export const failures = [
  {
    value: 1,
    type: 'number',
    refinement: 'max',
    path: [],
    branch: [data],
  },
]
