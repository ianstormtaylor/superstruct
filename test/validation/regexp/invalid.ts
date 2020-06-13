import { regexp } from '../../..'

export const Struct = regexp()

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'regexp',
  refinement: undefined,
  path: [],
  branch: [data],
}
