import { partial, string, number } from '../../../src'

export const Struct = partial({
  name: string(),
  age: number(),
})

export const data = {}

export const output = {}
