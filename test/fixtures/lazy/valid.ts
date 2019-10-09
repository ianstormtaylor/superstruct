import { struct } from '../../..'

const Other = struct('string')

export const Struct = struct.lazy(() => Other)

export const data = 'two'

export const output = 'two'
