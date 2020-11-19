import { number, positive } from '../../..'

export const Struct = positive(number())

export const data = -1

export const failures = [
  {
    value: -1,
    type: 'number',
    refinement: 'positive',
    path: [],
    branch: [data],
  },
]
