import { tuple, string, number } from '../../..'

export const Struct = tuple([string(), number()])

export const data = ['A', 3, 'unknown']

export const failures = [
  {
    value: 'unknown',
    type: 'never',
    refinement: undefined,
    path: [2],
    branch: [data, data[2]],
  },
]
