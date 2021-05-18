import { assert, union, literal, object, string } from '../..'
import { test } from '..'

test<{ a: string } | { b: string }>((x) => {
  assert(x, union([object({ a: string() }), object({ b: string() })]))
  return x
})

test<Union26>((x) => {
  assert(x, Union26Struct)
  return x
})

type Union26 =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

const Union26Struct = union([
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
