import { partial, string, number } from '../../..'

export const Struct = partial({
  name: string(),
  age: number(),
})

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'Partial<{name,age}>',
  path: [],
  branch: [data],
}
