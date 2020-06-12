import { number, negative } from '../../..'

export const Struct = negative(number())

export const data = 42

export const error = {
  value: 42,
  type: 'number',
  path: [],
  branch: [data],
}
