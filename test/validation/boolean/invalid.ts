import { boolean } from '../../..'

export const Struct = boolean()

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'boolean',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
