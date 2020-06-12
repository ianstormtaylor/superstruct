import { assert, omit, object, number, string } from '../..'
import { test } from '..'

test<{
  b: string
}>((x) => {
  assert(x, omit(object({ a: number(), b: string() }), ['a']))
  return x
})
