import { struct } from '../../..'

const Other = struct('string', 'lazy')

export const Struct = struct.lazy(() => Other)

export const data = undefined

export const output = 'lazy'
