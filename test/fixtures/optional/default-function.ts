import { number, optional } from '../../..'

export const Struct = optional(number(), () => 42)

export const data = undefined

export const output = 42

export const coerce = true
