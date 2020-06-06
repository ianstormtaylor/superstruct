import { number, defaulted } from '../../..'

export const Struct = defaulted(number(), () => 42)

export const data = undefined

export const output = 42

export const coerce = true
