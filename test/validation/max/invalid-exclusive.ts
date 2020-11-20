import { number, max } from '../../..'

export const Struct = max(number(), 0, true)

export const data = 0

export const failures = [
  {
    value: 0,
    type: 'number',
    refinement: 'max',
    path: [],
    branch: [data],
  },
]
