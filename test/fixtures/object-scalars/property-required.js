
import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number'
})

export const data = {
  name: undefined,
  age: 42,
}

export const error = {
  path: ['name'],
  value: undefined,
  type: 'string',
}
