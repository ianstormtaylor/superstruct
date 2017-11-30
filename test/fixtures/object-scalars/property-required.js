
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
  code: 'property_required',
  type: 'string',
  path: ['name'],
  key: 'name',
}
