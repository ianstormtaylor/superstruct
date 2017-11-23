
import isEmail from 'is-email'
import { superstruct } from '../../..'

const s = superstruct({
  types: {
    email: isEmail
  }
})

export const struct = s('email')

export const value = undefined

export const error = {
  code: 'value_required',
  type: 'email',
  path: [],
}
