import isEmail from 'is-email'
import { string, refine } from '../../..'

export const Struct = refine('email', string(), isEmail)

export const data = 'name@example.com'

export const output = 'name@example.com'
