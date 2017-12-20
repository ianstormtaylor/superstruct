
import isEmail from 'is-email'
import { superstruct } from '../../..'

const struct = superstruct({
  types: {
    email: (v) => {
      if (!isEmail(v)) return `${v} is not email`
    }
  }
})

export const Struct = struct('email')

export const data = 'invalid'

export const error = {
  path: [],
  value: 'invalid',
  type: 'email',
  code: 'invalid is not email'
}
