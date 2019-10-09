import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: v => {
      return isEmail(v) || [{ reason: `not_email` }]
    },
  },
})

export const Struct = struct.scalar('email')

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'email',
  reason: 'not_email',
}
