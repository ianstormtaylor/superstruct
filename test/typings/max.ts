import { assert, number, max } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, max(number(), 0))
  return x
})
