import { enums } from '../../..'

export const Struct = enums(['one', 'two'])

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'Enum<"one","two">',
    path: [],
    branch: [data],
  },
]
