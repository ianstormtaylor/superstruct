import { array, number } from '../../..'

export const Struct = array(number())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'array',
  refinement: undefined,
  path: [],
  branch: [data],
}
