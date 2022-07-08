import { string, number, coerce } from '../../../src'

export const Struct = coerce(string(), number(), (x) => 'known')

export const data = false

export const failures = [
  {
    value: false,
    type: 'string',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]

export const create = true
