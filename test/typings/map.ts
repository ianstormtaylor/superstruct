import { assert, map, string, number } from '../../src'
import { test } from '../index.test'

test<Map<string, number>>((x) => {
  assert(x, map(string(), number()))
  return x
})
