
import isEmail from 'is-email'
import { superstruct } from '../../..'

const s = superstruct({
  types: {
    email: isEmail
  }
})

export const struct = s('email')

export const value = 'sam@example.com'

export const output = 'sam@example.com'
