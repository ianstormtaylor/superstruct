import { set, number } from '../../..'

export const Struct = set(number())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'set',
  refinement: undefined,
  path: [],
  branch: [data],
}
