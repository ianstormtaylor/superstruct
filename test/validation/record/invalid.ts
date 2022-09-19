import { record, string, number } from '../../../src'

export const Struct = record(string(), number())

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'record',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
