import { assert, empty, string, array } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(x, empty(string()))
  return x
})

test<Array<unknown>>((x) => {
  assert(x, empty(array()))
  return x
})
