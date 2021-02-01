import { assert, number, min } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, min(number(), 0))
  return x
})
