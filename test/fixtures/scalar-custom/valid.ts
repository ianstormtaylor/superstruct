import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: isEmail,
  },
})

export const Struct = struct.scalar('email')

export const data = 'sam@example.com'

export const output = 'sam@example.com'
