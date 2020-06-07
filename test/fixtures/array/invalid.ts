import { array, number } from '../../..'

export const Struct = array(number())

export const data = 'invalid'

export const error = {
  value: 'invalid',
  type: 'Array<number>',
  path: [],
  branch: [data],
}
