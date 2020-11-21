import { assert, never } from '../..'
import { test } from '..'

test<never>((x) => {
  assert(x, never())
  return x
})
