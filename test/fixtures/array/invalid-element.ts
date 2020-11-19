import { array, number } from '../../..'

export const Struct = array(number())

export const data = [1, 'invalid', 3]

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    path: [1],
    branch: [data, data[1]],
  },
]
