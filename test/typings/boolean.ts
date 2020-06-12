import { assert, boolean } from '../..'
import { test } from '..'

test<boolean>((x) => {
  assert(x, boolean())
  return x
})
