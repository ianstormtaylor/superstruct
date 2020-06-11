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

export const error = {
  value: 42,
  type: 'never',
  path: ['age'],
  branch: [data, data.age],
}
