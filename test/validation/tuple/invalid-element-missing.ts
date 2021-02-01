import { tuple, string, number } from '../../..'

export const Struct = tuple([string(), number()])

export const data = ['A']

export const failures = [
  {
    value: undefined,
    type: 'number',
    refinement: undefined,
    path: [1],
    branch: [data, data[1]],
  },
]
