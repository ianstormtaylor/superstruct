import { number, nonnegative } from '../../..'

export const Struct = nonnegative(number())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'number',
  path: [],
  branch: [data],
}
