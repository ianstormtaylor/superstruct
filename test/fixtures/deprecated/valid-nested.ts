import { type, number, deprecated } from '../../..'

export const Struct = type({
  name: deprecated(() => {}),
  age: number(),
})

export const data = {
  age: 42,
}

export const output = {
  age: 42,
}
