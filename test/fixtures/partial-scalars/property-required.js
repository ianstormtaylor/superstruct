
import { struct } from '../../..'

export const Struct = struct.partial({
  name: 'string',
  age: 'number'
})

export const data = {
  name: undefined,
  age: 42,
  email: 'jane@example.com',
}

export const error = {
  path: ['name'],
  value: undefined,
  type: 'string',
}
