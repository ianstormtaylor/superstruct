import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: v => {
      if (!isEmail(v)) return `not_email`
    },
  },
})

export const Struct = struct('email')

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'email',
  reason: 'not_email',
}
