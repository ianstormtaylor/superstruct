import { type, string, number } from '../../..'

export const Struct = type({
  name: string(),
  age: number(),
})

export const data = {
  name: 'john',
  age: 42,
}

export const output = data
