
import isEmail from 'is-email'
import { superstruct } from '../../..'

const s = superstruct({
  types: {
    email: isEmail
  }
})

export const struct = s('email')

export const value = 'invalid'

export const error = {
  code: 'value_invalid',
  type: 'email',
  path: [],
  value: 'invalid',
}
