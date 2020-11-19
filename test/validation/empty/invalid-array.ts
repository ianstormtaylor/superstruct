import { array, empty } from '../../..'

export const Struct = empty(array())

export const data = ['invalid']

export const failures = [
  {
    value: ['invalid'],
    type: 'array',
    refinement: 'empty',
    path: [],
    branch: [data],
  },
]
