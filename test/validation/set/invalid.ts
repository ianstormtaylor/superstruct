import { set, number } from '../../..'

export const Struct = set(number())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'Set<number>',
  path: [],
  branch: [data],
}
