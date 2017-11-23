
import isEmail from 'is-email'
import { createStruct } from '../..'

const s = createStruct({
  types: {
    email: isEmail
  }
})

export const struct = s({
  email: 'email!',
})

export const value = {
  email: 'invalid'
}

export const error = {
  code: 'property_invalid',
  schema: 'email!',
  path: ['email'],
  key: 'email',
  value: 'invalid',
}
