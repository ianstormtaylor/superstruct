import { pick, object, string, number } from '../../..'

export const Struct = pick(
  object({
    name: string(),
    age: number(),
  }),
  ['age']
)

export const data = {
  age: 'invalid',
}

export const failures = [
  {
    value: 'invalid',
    type: 'number',
    refinement: undefined,
    path: ['age'],
    branch: [data, data.age],
  },
]
