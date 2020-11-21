import { number, min } from '../../..'

export const Struct = min(number(), 0, { exclusive: true })

export const data = 0

export const failures = [
  {
    value: 0,
    type: 'number',
    refinement: 'min',
    path: [],
    branch: [data],
  },
]
