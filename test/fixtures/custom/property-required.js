
import isEmail from 'is-email'
import { createStruct } from '../../..'

const s = createStruct({
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
