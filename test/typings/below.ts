import { assert, number, below } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, below(number(), 0))
  return x
})
