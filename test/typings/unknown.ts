import { assert, unknown } from '../..'
import { test } from '..'

test<unknown>((x) => {
  assert(x, unknown())
  return x
})
