import { struct } from '../../..'

export const Struct = struct.intersection([
  struct.partial({
    name: 'string',
  }),
  struct.partial({
    age: 'number',
  }),
])

export const data = {
  name: 'john',
  age: 42,
}

export const output = {
  name: 'john',
  age: 42,
}
