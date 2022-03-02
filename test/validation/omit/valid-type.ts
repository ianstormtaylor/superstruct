import { omit, type, string, number } from '../../../lib'

export const Struct = omit(
  type({
    name: string(),
    age: number(),
  }),
  ['age']
)

export const data = {
  name: 'john',
  unknownProperty: 'unknown',
}

export const output = {
  name: 'john',
  unknownProperty: 'unknown',
}
