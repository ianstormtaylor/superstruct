import { set, number } from '../../..'

export const Struct = set(number())

export const data = new Set([1, 'b', 3])

export const error = {
  value: new Set([1, 'b', 3]),
  type: 'Set<number>',
  path: [],
  branch: [data],
}
