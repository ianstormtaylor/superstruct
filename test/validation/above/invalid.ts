import { number, above } from '../../..'

export const Struct = above(number(), 0)

export const data = -1

export const failures = [
  {
    value: -1,
    type: 'number',
    refinement: 'above',
    path: [],
    branch: [data],
  },
]
