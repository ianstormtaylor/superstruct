import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: v => {
      if (!isEmail(v)) return { reason: `not_email`, path: ['email'] }
    },
  },
})

export const Struct = struct('email?')

export const data = 'optional_invalid'

export const error = {
  path: ['email'],
  value: 'optional_invalid',
  type: 'email | undefined',
  reason: 'not_email',
}
