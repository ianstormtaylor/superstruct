import { string, size } from '../../..'

export const Struct = size(string(), 1, 5)

export const data = 'abcde'

export const output = 'abcde'
