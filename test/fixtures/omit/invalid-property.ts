import { omit, object, string, number } from '../../..'

export const Struct = omit(
  object({
    name: string(),
    age: number(),
  }),
  ['name']
)

export const data = {
  age: 'invalid',
}

export const error = {
  value: 'invalid',
  type: 'number',
  path: ['age'],
  branch: [data, data.age],
}
