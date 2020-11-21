import { regexp } from '../../..'

export const Struct = regexp()

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'regexp',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
