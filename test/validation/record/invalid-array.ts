import { record, string, number } from '../../../src'

export const Struct = record(string(), number())

export const data = []

export const failures = [
  {
    value: [],
    type: 'record',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
