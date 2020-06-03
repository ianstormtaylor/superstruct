import { partial, string, number } from '../../..'

export const Struct = partial({
  name: string(),
  age: number(),
})

export const data = {
  age: 'invalid',
}

export const error = {
  path: ['age'],
  value: 'invalid',
  type: 'number',
}
