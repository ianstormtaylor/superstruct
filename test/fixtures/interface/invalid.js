import { struct } from '../../..'

export const Struct = struct.interface({
  name: 'string',
  age: 'number',
})

export const data = 'invalid'

export const error = {
  path: ['name'],
  value: undefined,
  type: 'string',
  reason: null,
}
