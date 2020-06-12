import { pick, object, string, number } from '../../..'

export const Struct = pick(
  object({
    name: string(),
    age: number(),
  }),
  ['name']
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
