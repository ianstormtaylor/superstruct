import { tuple, string, number } from '../../..'

export const Struct = tuple([string(), number()])

export const data = [false, 3]

export const failures = [
  {
    value: false,
    type: 'string',
    refinement: undefined,
    path: [0],
    branch: [data, data[0]],
  },
]
