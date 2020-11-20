import isEmail from 'is-email'
import { string, refine } from '../../..'

export const Struct = refine('email', string(), isEmail)

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
