import { number, nullable } from '../../..'

export const Struct = nullable(number())

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    path: [],
    branch: [data],
  },
]
