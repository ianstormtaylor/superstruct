import { enums } from '../../..'

export const Struct = enums(['one', 'two'])

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'Enum<"one","two">',
  path: [],
  branch: [data],
}
