import { shape, string, number } from '../../..'

export const Struct = shape({
  name: string(),
  age: number(),
})

export const data = {
  name: 'john',
  age: 'invalid',
}

export const error = {
  value: 'invalid',
  type: 'number',
  refinement: undefined,
  path: ['age'],
  branch: [data, data.age],
}
