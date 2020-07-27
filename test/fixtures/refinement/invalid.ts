import isEmail from 'is-email'
import { string, refinement } from '../../..'

export const Struct = refinement(string(), 'Email', isEmail)

export const data = 'invalid'

export const failures = [
  {
    value: 'invalid',
    type: 'Email',
    path: [],
    branch: [data],
  },
]
