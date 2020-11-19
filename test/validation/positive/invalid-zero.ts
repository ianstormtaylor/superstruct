import { number, positive } from '../../..'

export const Struct = positive(number())

export const data = 0

export const failures = [
  {
    value: 0,
    type: 'number',
    refinement: 'positive',
    path: [],
    branch: [data],
  },
]
