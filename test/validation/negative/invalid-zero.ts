import { number, negative } from '../../..'

export const Struct = negative(number())

export const data = 0

export const failures = [
  {
    value: 0,
    type: 'number',
    refinement: 'negative',
    path: [],
    branch: [data],
  },
]
