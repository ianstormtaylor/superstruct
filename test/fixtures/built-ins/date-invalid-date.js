import { struct } from '../../..'

const invalid = new Date('invalid')

export const Struct = struct('date')

export const data = invalid

export const error = {
  path: [],
  value: invalid,
  type: 'date',
  reason: null,
}
