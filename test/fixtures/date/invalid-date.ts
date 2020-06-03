import { date } from '../../..'

export const Struct = date()

export const data = new Date('invalid')

export const error = {
  path: [],
  value: data,
  type: 'Date',
}
