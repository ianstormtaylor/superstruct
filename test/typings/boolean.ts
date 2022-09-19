import { assert, boolean } from '../../src'
import { test } from '..'

test<boolean>((x) => {
  assert(x, boolean())
  return x
})
