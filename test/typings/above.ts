import { assert, number, above } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, above(number(), 0))
  return x
})
