import { struct } from '../../..'

export const Struct = struct.interface({
  name: 'string',
  age: 'number',
})

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'interface<{name,age}>',
  reason: null,
}
