
import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number'
})

export const data = {
  name: 'john',
  age: 'invalid',
}

export const error = {
  code: 'property_invalid',
  type: 'number',
  path: ['age'],
  key: 'age',
  value: 'invalid',
}
