import { array, empty, number } from '../../..'

export const Struct = empty(array(number()))

export const data = [1, 2, 3]

export const failures = [
  {
    value: data,
    type: 'array',
    refinement: 'empty',
    path: [],
    branch: [data],
  },
]
