import { assert, set, string } from '../../src'
import { test } from '../index.test'

test<Set<string>>((x) => {
  assert(x, set(string()))
  return x
})
