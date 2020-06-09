import { assert, length, string, array } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(x, length(string(), 1, 5))
  return x
})

test<Array<unknown>>((x) => {
  assert(x, length(array(), 1, 5))
  return x
})
