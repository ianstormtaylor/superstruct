import { object, string, number } from '../../../src'

export const Struct = object({
  name: string(),
  age: number(),
})

export const data = Object.freeze({
  name: 'john',
  age: 42,
})

export const output = {
  name: 'john',
  age: 42,
}

export const create = true
