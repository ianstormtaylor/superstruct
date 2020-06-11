import { assert, number, nonpositive } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, nonpositive(number()))
  return x
})
