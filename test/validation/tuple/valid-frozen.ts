import { tuple, string, number } from '../../../src'

export const Struct = tuple([string(), number()])

export const data = Object.freeze(['A', 1])

export const output = ['A', 1]

export const create = true
