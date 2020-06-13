import { number, positive } from '../../..'

export const Struct = positive(number())

export const data = -1

export const error = {
  value: -1,
  type: 'number',
  refinement: 'positive',
  path: [],
  branch: [data],
}
