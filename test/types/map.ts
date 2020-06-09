import { assert, map, string, number } from '../..'
import { test } from '..'

test<Map<string, number>>((x) => {
  assert(x, map(string(), number()))
  return x
})
