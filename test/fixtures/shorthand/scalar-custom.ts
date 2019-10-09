import isEmail from 'is-email'
import { superstruct } from '../../../lib'

const struct = superstruct({
  types: {
    email: isEmail,
  },
})

export const Struct = struct('email')

export const data = 'invalid'

export const error = {
  type: 'email',
  value: 'invalid',
  path: [],
}
