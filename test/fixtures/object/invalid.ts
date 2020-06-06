import { object, string, number } from '../../..'

export const Struct = object({
  name: string(),
  age: number(),
})

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'Object<{name,age}>',
}
