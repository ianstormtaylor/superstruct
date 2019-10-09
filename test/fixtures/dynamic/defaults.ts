import { struct } from '../../..'

const validator = struct('string', 'dynamic')

export const Struct = struct.dynamic(() => validator)

export const data = undefined

export const output = 'dynamic'
