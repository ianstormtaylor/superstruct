import { deprecated, number } from '../../..'

export const Struct = deprecated(number(), () => {})

export const data = '42'

export const failures = [
  {
    value: '42',
    type: 'number',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
