import { string, trimmed } from '../../../src'

export const Struct = trimmed(string())

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
