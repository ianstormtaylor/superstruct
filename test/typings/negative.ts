import { assert, number, negative } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, negative(number()))
  return x
})
