import { literal } from '../../..'

export const Struct = literal(42)

export const data = false

export const failures = [
  {
    value: false,
    type: 'literal',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
