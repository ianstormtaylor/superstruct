import { struct } from '../../..'

const validator = struct('string')

export const Struct = struct.lazy(() => validator)

export const data = 3

export const error = {
  path: [],
  value: 3,
  type: 'string',
  reason: null,
}
