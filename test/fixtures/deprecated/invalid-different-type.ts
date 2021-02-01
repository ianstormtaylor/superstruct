import { deprecated, number } from '../../..'

export const Struct = deprecated(number(), () => {})

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'number',
  path: [],
  branch: [data],
}
