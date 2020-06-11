import { omit, object, string, number } from '../../..'

export const Struct = omit(
  object({
    name: string(),
    age: number(),
  }),
  ['age']
)

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'Object<{name}>',
  path: [],
  branch: [data],
}
