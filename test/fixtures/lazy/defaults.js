import { struct } from '../../..'

const validator = struct('string', 'lazy')

export const Struct = struct.lazy(() => validator)

export const data = undefined

export const output = 'lazy'
