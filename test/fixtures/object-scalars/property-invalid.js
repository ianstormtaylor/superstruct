
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
  path: ['age'],
  value: 'invalid',
  type: 'number',
}
