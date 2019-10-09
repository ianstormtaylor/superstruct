import { struct } from '../../..'

const Other = struct.optional('string')

export const Struct = struct.lazy(() => Other)

export const data = undefined

export const output = undefined
