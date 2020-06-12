import { literal } from '../../..'

export const Struct = literal(42)

export const data = false

export const error = {
  value: false,
  type: 'Literal<42>',
  path: [],
  branch: [data],
}
