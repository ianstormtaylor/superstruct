import { map, empty, number, string } from '../../..'

export const Struct = empty(map(number(), string()))

export const data = new Map([[1, 'a']])

export const failures = [
  {
    value: data,
    type: 'map',
    refinement: 'empty',
    path: [],
    branch: [data],
  },
]
