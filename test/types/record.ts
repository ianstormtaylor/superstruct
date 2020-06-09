import { assert, record, string, number } from '../..'
import { test } from '..'

test<Record<string, number>>((x) => {
  assert(x, record(string(), number()))
  return x
})
