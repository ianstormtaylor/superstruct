
import isEmail from 'is-email'
import { superstruct } from '../../..'

const s = superstruct({
  types: {
    email: isEmail
  }
})

export const struct = s({
  email: 'email',
})

export const value = {}

export const error = {
  code: 'property_required',
  type: 'email',
  path: ['email'],
  key: 'email',
}
