import { set, size, number } from '../../..'

export const Struct = size(set(number()), 1, 5)

export const data = new Set()

export const failures = [
  {
    value: data,
    type: 'set',
    refinement: 'size',
    path: [],
    branch: [data],
  },
]
