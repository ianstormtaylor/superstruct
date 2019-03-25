import { struct } from '../../..'

const validator = struct('string')

export const Struct = struct.lazy(() => validator)

export const data = 'two'

export const output = 'two'
