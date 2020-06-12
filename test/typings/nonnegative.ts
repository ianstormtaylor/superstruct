import { assert, number, nonnegative } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, nonnegative(number()))
  return x
})
