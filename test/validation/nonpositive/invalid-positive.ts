import { number, nonpositive } from '../../..'

export const Struct = nonpositive(number())

export const data = 42

export const failures = [
  {
    value: 42,
    type: 'number',
    refinement: 'nonpositive',
    path: [],
    branch: [data],
  },
]
