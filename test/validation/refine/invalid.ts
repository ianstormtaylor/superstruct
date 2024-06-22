import { string, refine } from '../../../src'

export const Struct = refine(string(), 'email', (value) => value.includes('@'))

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'string',
    refinement: 'email',
    path: [],
    branch: [data],
  },
]
