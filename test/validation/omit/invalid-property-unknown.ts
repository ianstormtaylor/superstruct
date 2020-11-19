import { omit, object, string, number } from '../../..'

export const Struct = omit(
  object({
    name: string(),
    age: number(),
  }),
  ['age']
)

export const data = {
  name: 'john',
  age: 42,
}

export const failures = [
  {
    value: 42,
    type: 'never',
    refinement: undefined,
    path: ['age'],
    branch: [data, data.age],
  },
]
