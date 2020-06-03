import { struct } from '../../..'

export const Struct = struct.pick({
  name: 'string?',
  age: 'number',
})

export const data = {
  age: 42,
  email: 'jane@example.com',
}

export const output = {
  age: 42,
}
