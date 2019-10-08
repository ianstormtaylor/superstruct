import { struct } from '../../..'

export const Struct = struct.pick({
  name: 'string',
  age: 'number',
})

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'pick<{name,age}>',
}
