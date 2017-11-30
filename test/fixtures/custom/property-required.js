
import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: isEmail
  }
})

export const Struct = struct({
  email: 'email',
})

export const data = {}

export const error = {
  code: 'property_required',
  type: 'email',
  path: ['email'],
  key: 'email',
}
