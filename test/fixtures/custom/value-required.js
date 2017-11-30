
import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: isEmail
  }
})

export const Struct = struct('email')

export const data = undefined

export const error = {
  code: 'value_required',
  type: 'email',
  path: [],
}
