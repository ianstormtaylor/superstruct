import { number, optional } from '../../..'

export const Struct = optional(number())

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'number',
}
