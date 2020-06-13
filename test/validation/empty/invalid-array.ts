import { array, empty } from '../../..'

export const Struct = empty(array())

export const data = ['invalid']

export const error = {
  value: ['invalid'],
  type: 'array',
  refinement: 'empty',
  path: [],
  branch: [data],
}
