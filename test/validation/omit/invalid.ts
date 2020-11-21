import { omit, object, string, number } from '../../..'

export const Struct = omit(
  object({
    name: string(),
    age: number(),
  }),
  ['age']
)

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'object',
    refinement: undefined,
    path: [],
    branch: [data],
  },
]
