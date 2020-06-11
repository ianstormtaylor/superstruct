import { assert, number, positive } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, positive(number()))
  return x
})
