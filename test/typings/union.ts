import { assert, union, object, string } from '../..'
import { test } from '..'

test<{ a: string } | { b: string }>((x) => {
  assert(x, union([object({ a: string() }), object({ b: string() })]))
  return x
})
