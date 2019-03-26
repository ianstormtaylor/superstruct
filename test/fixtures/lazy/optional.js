import { struct } from '../../..'

const validator = struct.optional('string')

export const Struct = struct.lazy(() => validator)

export const data = undefined

export const output = undefined
