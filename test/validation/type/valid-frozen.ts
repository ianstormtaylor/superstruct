import { type, string, number } from '../../../src'

export const Struct = type({
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
