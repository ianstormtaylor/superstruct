
import s from '../..'

export const struct = s(v => v === 42)

export const value = 21

export const error = {
  code: 'value_invalid',
  path: [],
  value: 21,
}
