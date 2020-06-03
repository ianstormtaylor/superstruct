import { array, length, number } from '../../..'

export const Struct = length(array(number()), 1, 5)

export const data = []

export const error = {
  path: [],
  value: [],
  type: 'Constrained<Array<number>>',
}
