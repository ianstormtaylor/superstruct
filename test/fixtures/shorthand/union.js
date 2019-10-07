import { struct } from '../../../lib'

export const Struct = struct('string|number')

export const data = false

export const error = {
  type: 'string | number',
  value: false,
  path: [],
}
