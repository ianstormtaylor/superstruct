import { struct } from '../../..'

export const Struct = struct(
  {
    name: 'string?',
    age: 'number',
  },
  {
    name: 'unknown',
  }
)

export const data = {
  age: 42,
}

export const output = {
  name: 'unknown',
  age: 42,
}
