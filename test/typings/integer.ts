import { assert, integer } from '../../src'
import { test } from '..'

test<number>((x) => {
  assert(x, integer())
  return x
})
