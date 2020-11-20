import { number, min } from '../../..'

export const Struct = min(number(), 0)

export const data = -1

export const failures = [
  {
    value: -1,
    type: 'number',
    refinement: 'min',
    path: [],
    branch: [data],
  },
]
