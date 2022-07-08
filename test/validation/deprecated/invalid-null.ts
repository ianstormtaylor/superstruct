import { deprecated, string } from '../../../src'

export const Struct = deprecated(string(), () => {})

export const data = null

export const failures = [
  {
    value: null,
    type: 'string',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
