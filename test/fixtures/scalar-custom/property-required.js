import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: isEmail,
  },
})

export const Struct = struct.object({
  email: 'email',
})

export const data = {}

export const error = {
  path: ['email'],
  type: 'email',
  value: undefined,
}
