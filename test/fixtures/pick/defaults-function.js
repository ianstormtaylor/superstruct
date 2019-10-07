import { struct } from '../../..'

export const Struct = struct.pick(
  {
    name: 'string',
  },
  {
    name: () => 'John Doe',
  }
)

export const data = { age: 26 }

export const output = {
  name: 'John Doe',
}
