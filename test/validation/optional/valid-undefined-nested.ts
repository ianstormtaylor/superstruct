import { shape, string, number, optional } from '../../..'

export const Struct = shape({
  name: optional(string()),
  age: number(),
})

export const data = {
  age: 42,
}

export const output = {
  age: 42,
}
