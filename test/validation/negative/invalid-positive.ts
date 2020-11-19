import { number, negative } from '../../..'

export const Struct = negative(number())

export const data = 42

export const failures = [
  {
    value: 42,
    type: 'number',
    refinement: 'negative',
    path: [],
    branch: [data],
  },
]
