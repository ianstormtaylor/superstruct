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
}

export const output = {
  name: 'john',
}
