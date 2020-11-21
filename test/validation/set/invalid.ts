import { set, number } from '../../..'

export const Struct = set(number())

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'set',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
