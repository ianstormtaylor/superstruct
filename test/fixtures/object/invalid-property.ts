import { object, string, number } from '../../..'

export const Struct = object({
  name: string(),
  age: number(),
})

export const data = {
  name: 'john',
  age: 'invalid',
}

export const error = {
  path: ['age'],
  value: 'invalid',
  type: 'number',
}
