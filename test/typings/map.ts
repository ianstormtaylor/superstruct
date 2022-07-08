import { assert, map, string, number } from '../../src'
import { test } from '..'

test<Map<string, number>>((x) => {
  assert(x, map(string(), number()))
  return x
})
