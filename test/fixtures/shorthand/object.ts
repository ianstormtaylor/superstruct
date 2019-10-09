import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number',
})

export const data = 'invalid'

export const error = {
  type: '{name,age}',
  value: 'invalid',
  path: [],
}
