
import { struct } from '../../..'

export const Struct = struct.partial({
  name: 'string',
  age: 'number'
})

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: '{name,age,...}',
}
