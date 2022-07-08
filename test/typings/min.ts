import { assert, number, min } from '../../src'
import { test } from '..'

test<number>((x) => {
  assert(x, min(number(), 0))
  return x
})
