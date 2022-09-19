import { assert, string } from '../../src'
import { test } from '..'

test<string>((x) => {
  assert(x, string())
  return x
})
