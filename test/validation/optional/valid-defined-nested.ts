import { shape, string, number, optional } from '../../..'

export const Struct = shape({
  name: optional(string()),
  age: number(),
})

export const data = {
  name: 'Jill',
  age: 42,
}

export const output = {
  name: 'Jill',
  age: 42,
}
