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
}

export const output = {
  name: 'john',
}
