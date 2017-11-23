
import isEmail from 'is-email'
import { createStruct } from '../../..'

const s = createStruct({
  types: {
    email: isEmail
  }
})

export const struct = s('email')

export const value = 'invalid'

export const error = {
  code: 'value_invalid',
  type: 'email',
  path: [],
  value: 'invalid',
}
