import { array, empty } from '../../..'

export const Struct = empty(array())

export const data = ['invalid']

export const error = {
  value: ['invalid'],
  type: 'Array<unknown> & Empty',
  path: [],
  branch: [data],
}
