
import isEmail from 'is-email'
import { createStruct } from '../..'

const s = createStruct({
  types: {
    email: isEmail
  }
})

export const struct = s('email')

export const value = 'sam@example.com'

export const output = 'sam@example.com'
