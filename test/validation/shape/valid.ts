import { shape, string, number } from '../../..'

export const Struct = shape({
  name: string(),
  age: number(),
})

export const data = {
  name: 'john',
  age: 42,
}

export const output = data
