import { number, positive } from '../../..'

export const Struct = positive(number())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'number',
  path: [],
  branch: [data],
}
