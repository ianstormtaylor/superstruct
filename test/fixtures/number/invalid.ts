import { number } from '../../..'

export const Struct = number()

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    path: [],
    branch: [data],
  },
]
