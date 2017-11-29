
import { struct as s } from '../../..'

export const struct = s({
  name: 'string',
  age: 'number'
})

export const value = {
  name: undefined,
  age: 42,
}

export const error = {
  code: 'property_required',
  type: 'string',
  path: ['name'],
  key: 'name',
}
