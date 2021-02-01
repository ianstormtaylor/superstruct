import { date } from '../../..'

export const Struct = date()

export const data = new Date('invalid')

export const failures = [
  {
    value: data,
    type: 'date',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
