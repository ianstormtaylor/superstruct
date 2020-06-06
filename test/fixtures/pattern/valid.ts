import { string, pattern } from '../../..'

export const Struct = pattern(string(), /\d+/)

export const data = '123'

export const output = '123'
