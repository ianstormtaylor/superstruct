import { set, number } from '../../..'

export const Struct = set(number())

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'Set<number>',
    path: [],
    branch: [data],
  },
]
