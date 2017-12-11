
import { struct } from '../../..'

export const Struct = struct.union(['string', 'number'])

export const data = false

export const error = {
  path: [],
  value: false,
  type: 'string | number',
}
