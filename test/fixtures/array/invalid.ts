import { array, number } from '../../..'

export const Struct = array(number())

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'Array<number>',
    path: [],
    branch: [data],
  },
]
