
import { struct } from '../../..'

export const Struct = struct.partial({
  name: 'string?',
  age: 'number'
}, {
  name: 'unknown',
})

export const data = {
  age: 42,
  email: 'jane@example.com',
}

export const output = {
  name: 'unknown',
  age: 42,
}
