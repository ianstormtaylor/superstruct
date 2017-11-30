
import { struct } from '../../..'

export const Struct = struct({
  name: 'string',
  age: 'number'
})

export const data = {
  name: 'john',
  age: 42,
  unknown: true,
}

export const error = {
  code: 'property_unknown',
  path: ['unknown'],
  key: 'unknown',
}
