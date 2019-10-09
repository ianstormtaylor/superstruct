import { struct } from '../../..'

export const Struct = struct.pick(
  {
    name: 'string',
    age: 'number',
  },
  {
    name: 'john',
    age: 42,
  }
)

export const data = { age: 20 }

export const output = {
  name: 'john',
  age: 20,
}
