import { assert, set, string } from '../../src'
import { test } from '..'

test<Set<string>>((x) => {
  assert(x, set(string()))
  return x
})
