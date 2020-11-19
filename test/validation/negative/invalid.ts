import { number, negative } from '../../..'

export const Struct = negative(number())

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
