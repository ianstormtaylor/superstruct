import { assert, masked, object, number } from '../..'
import { test } from '..'

test<{ a: number }>((x) => {
  assert(x, masked(object({ a: number() })))
  return x
})
