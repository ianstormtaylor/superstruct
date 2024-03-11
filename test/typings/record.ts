import { assert, record, string, number } from '../../src'
import { test } from '../index.test'

test<Record<string, number>>((x) => {
  assert(x, record(string(), number()))
  return x
})
