import { number, positive } from '../../..'

export const Struct = positive(number())

export const data = 0

export const error = {
  value: 0,
  type: 'number',
  refinement: 'positive',
  path: [],
  branch: [data],
}
