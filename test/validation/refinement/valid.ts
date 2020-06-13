import isEmail from 'is-email'
import { string, refinement } from '../../..'

export const Struct = refinement('email', string(), isEmail)

export const data = 'name@example.com'

export const output = 'name@example.com'
