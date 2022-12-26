import { partial, type, string, number } from '../../..'

export const Struct = partial(
  type({
    name: string(),
    age: number(),
  })
)

export const data = {
  name: 'john',
  location: 'mars',
}

export const output = {
  name: 'john',
  location: 'mars',
}
