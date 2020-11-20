import { masked, object, string } from '../../..'

export const Struct = masked(object({ name: string() }))

export const data = false

export const failures = [
  {
    value: false,
    type: 'object',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]

export const create = true
