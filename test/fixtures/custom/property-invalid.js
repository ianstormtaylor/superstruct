
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

export const value = {
  email: 'invalid'
}

export const error = {
  code: 'property_invalid',
  type: 'email',
  path: ['email'],
  key: 'email',
  value: 'invalid',
}
