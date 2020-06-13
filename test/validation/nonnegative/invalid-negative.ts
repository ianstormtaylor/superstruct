import { number, nonnegative } from '../../..'

export const Struct = nonnegative(number())

export const data = -1

export const error = {
  value: -1,
  type: 'number',
  refinement: 'nonnegative',
  path: [],
  branch: [data],
}
