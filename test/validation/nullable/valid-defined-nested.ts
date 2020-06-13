import { shape, string, number, nullable } from '../../..'

export const Struct = shape({
  name: nullable(string()),
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
