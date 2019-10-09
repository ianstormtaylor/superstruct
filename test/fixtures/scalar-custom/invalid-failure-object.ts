import isEmail from 'is-email'
import { superstruct, Failure } from '../../../lib'

const struct = superstruct({
  types: {
    email: (value: any): boolean | Partial<Failure> => {
      if (isEmail(value)) {
        return true
      } else {
        return { reason: `not_email` }
      }
    },
  },
})

export const Struct = struct.scalar('email')

export const data = 'invalid'

export const error = {
  type: 'email',
  path: [],
  value: 'invalid',
  reason: 'not_email',
}
