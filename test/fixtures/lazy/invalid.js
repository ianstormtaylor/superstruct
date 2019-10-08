import { struct } from '../../..'

const Other = struct('string')

export const Struct = struct.lazy(() => Other)

export const data = 3

export const error = {
  path: [],
  value: 3,
  type: 'string',
}
