import { struct } from '../../..'

const validator = struct.optional('string')

export const Struct = struct.dynamic(() => validator)

export const data = undefined

export const output = undefined
