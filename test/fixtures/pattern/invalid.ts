import { string, pattern } from '../../..'

export const Struct = pattern(string(), /\d+/)

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'string & Pattern<\\d+>',
    path: [],
    branch: [data],
  },
]
