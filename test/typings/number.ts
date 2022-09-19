import { assert, number } from '../../src'
import { test } from '..'

test<number>((x) => {
  assert(x, number())
  return x
})
