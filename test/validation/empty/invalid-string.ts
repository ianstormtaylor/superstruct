import { string, empty } from '../../..'

export const Struct = empty(string())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'string',
  refinement: 'empty',
  path: [],
  branch: [data],
}
