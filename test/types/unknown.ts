import { assert, unknown } from '../../lib'
import { test } from '..'

test<unknown>((x) => {
  assert(x, unknown())
  return x
})
