import { integer } from '../../..'

export const Struct = integer()

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'integer',
  path: [],
  branch: [data],
}
