import { partial, string, number } from '../../..'

export const Struct = partial({
  name: string(),
  age: number(),
})

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'Partial<{name,age}>',
}
