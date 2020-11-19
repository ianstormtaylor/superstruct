import isEmail from 'is-email'
import { string, refinement } from '../../..'

export const Struct = refinement('email', string(), isEmail)

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'string',
    refinement: 'email',
    path: [],
    branch: [data],
  },
]
