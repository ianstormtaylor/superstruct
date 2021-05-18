import { union, literal, Infer } from '../../..'

export const Struct = union([
  literal('a'),
  literal('b'),
  literal('c'),
  literal('d'),
  literal('e'),
  literal('f'),
  literal('g'),
  literal('h'),
  literal('i'),
  literal('j'),
  literal('k'),
  literal('l'),
  literal('m'),
  literal('n'),
  literal('o'),
  literal('p'),
  literal('q'),
  literal('r'),
  literal('s'),
  literal('t'),
  literal('u'),
  literal('v'),
  literal('w'),
  literal('x'),
  literal('y'),
  literal('z'),
])

export const data: Infer<typeof Struct> = 'z'

export const output = 'z'
