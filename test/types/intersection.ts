import { assert, intersection, object, string } from '../..'
import { test } from '..'

test<{ a: string } & { b: string }>((x) => {
  assert(x, intersection([object({ a: string() }), object({ b: string() })]))
  return x
})
