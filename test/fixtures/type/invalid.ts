import { type, string, number } from '../../..'

export const Struct = type({
  name: string(),
  age: number(),
})

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'Type<{name,age}>',
}
