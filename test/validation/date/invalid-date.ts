import { date } from '../../..'

export const Struct = date()

export const data = new Date('invalid')

export const error = {
  value: data,
  type: 'Date',
  path: [],
  branch: [data],
}
