import { tuple, string, number } from '../../..'

export const Struct = tuple([string(), number()])

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: '[string,number]',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
