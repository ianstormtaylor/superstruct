import { number, optional } from '../../..'

export const Struct = optional(number())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'number',
  refinement: undefined,
  path: [],
  branch: [data],
}
