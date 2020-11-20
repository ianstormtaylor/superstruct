import { set, empty, number } from '../../..'

export const Struct = empty(set(number()))

export const data = new Set([1, 2, 3])

export const failures = [
  {
    value: data,
    type: 'set',
    refinement: 'empty',
    path: [],
    branch: [data],
  },
]
