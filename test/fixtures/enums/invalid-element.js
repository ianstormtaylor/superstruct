
import { struct } from '../../..'

export const Struct = struct.enums(['one', 'two'])

export const data = ['three']

export const error = {
  path: [0],
  value: 'three',
  type: '"one" | "two"',
}
