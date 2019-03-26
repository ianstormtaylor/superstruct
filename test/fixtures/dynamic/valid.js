import { struct } from '../../..'

const validator = struct('string')

export const Struct = struct.dynamic(() => validator)

export const data = 'two'

export const output = 'two'
