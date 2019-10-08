import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: isEmail,
  },
})

export const Struct = struct.scalar('email')

export const data = undefined

export const error = {
  path: [],
  value: undefined,
  type: 'email',
}
