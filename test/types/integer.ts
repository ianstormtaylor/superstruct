import { assert, integer } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, integer())
  return x
})
