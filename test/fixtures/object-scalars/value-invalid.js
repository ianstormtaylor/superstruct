
import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number'
})

export const data = 'invalid'

export const error = {
  code: 'value_invalid',
  type: 'object',
  path: [],
  value: 'invalid',
}
