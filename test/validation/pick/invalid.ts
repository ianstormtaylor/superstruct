import { pick, object, string, number } from '../../..'

export const Struct = pick(
  object({
    name: string(),
    age: number(),
  }),
  ['name']
)

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'Object<{name}>',
  path: [],
  branch: [data],
}
