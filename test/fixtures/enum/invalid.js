import { struct } from '../../..'

export const Struct = struct.enum(['one', 'two'])

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: '"one" | "two"',
}
