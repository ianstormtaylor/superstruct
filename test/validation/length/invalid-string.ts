import { string, length } from '../../..'

export const Struct = length(string(), 1, 5)

export const data = ''

export const failures = [
  {
    value: '',
    type: 'string',
    refinement: 'length',
    path: [],
    branch: [data],
  },
]
