import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: v => {
      if (!isEmail(v)) return `not_email`
    },
  },
})

export const Struct = struct('email?')

export const data = 'optional_invalid'

export const error = {
  path: [],
  value: 'optional_invalid',
  type: 'email | undefined',
  reason: 'not_email',
}
