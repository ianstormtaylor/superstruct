import { number, below } from '../../..'

export const Struct = below(number(), 0)

export const data = 1

export const failures = [
  {
    value: 1,
    type: 'number',
    refinement: 'below',
    path: [],
    branch: [data],
  },
]
