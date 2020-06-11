import { number, negative } from '../../..'

export const Struct = negative(number())

export const data = 0

export const error = {
  value: 0,
  type: 'number',
  path: [],
  branch: [data],
}
