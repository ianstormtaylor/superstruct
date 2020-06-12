import { assert, assign, object, number, string } from '../../lib'
import { test } from '..'

test<{
  a: number
  b: string
}>((x) => {
  assert(x, assign([object({ a: number() }), object({ b: string() })]))
  return x
})
