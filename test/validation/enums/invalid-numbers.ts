import { enums } from '../../..'

export const Struct = enums([1, 2])

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'Enum<1,2>',
  path: [],
  branch: [data],
}
