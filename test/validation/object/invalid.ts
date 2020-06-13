import { object, string, number } from '../../..'

export const Struct = object({
  name: string(),
  age: number(),
})

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'object',
  refinement: undefined,
  path: [],
  branch: [data],
}
