
import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: isEmail
  }
})

export const Struct = struct('email')

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'email',
}
