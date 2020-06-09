import { assert, number } from '../..'
import { test } from '..'

test<number>((x) => {
  assert(x, number())
  return x
})
