import { number, optional } from '../../..'

export const Struct = optional(number())

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
