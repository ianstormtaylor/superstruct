import { array, size, number } from '../../..'

export const Struct = size(array(number()), 1, 5)

export const data = []

export const failures = [
  {
    value: [],
    type: 'array',
    refinement: 'size',
    path: [],
    branch: [data],
  },
]
