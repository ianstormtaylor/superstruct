import { assert, unknown } from '../../src'
import { test } from '..'

test<unknown>((x) => {
  assert(x, unknown())
  return x
})
