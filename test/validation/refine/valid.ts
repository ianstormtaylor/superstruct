import { string, refine } from '../../../src'

export const Struct = refine(string(), 'email', (value) => value.includes('@'))

export const data = 'name@example.com'

export const output = 'name@example.com'
