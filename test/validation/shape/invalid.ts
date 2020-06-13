import { shape, string, number } from '../../..'

export const Struct = shape({
  name: string(),
  age: number(),
})

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'shape',
  refinement: undefined,
  path: [],
  branch: [data],
}
