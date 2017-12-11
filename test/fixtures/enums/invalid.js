
import { struct } from '../../..'

export const Struct = struct.enums(['one', 'two'])

export const data = 'three'

export const error = {
  path: [],
  value: 'three',
  type: '["one" | "two"]',
}
