import { number, nonnegative } from '../../..'

export const Struct = nonnegative(number())

export const data = 42

export const output = 42
