import { array, number } from '../../..'

export const Struct = array(number())

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'Array<number>',
}
