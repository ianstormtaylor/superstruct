import { assert, never } from '../../src'
import { test } from '..'

test<never>((x) => {
  assert(x, never())
  return x
})
