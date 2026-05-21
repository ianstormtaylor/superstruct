import { assert, record, string, number } from '../../src'
import { test } from '..'

test<Record<string, number>>((x) => {
  assert(x, record(string(), number()))
  return x
})

test<Record<number, number>>((x) => {
  assert(x, record(number(), number()))
  return x
})
