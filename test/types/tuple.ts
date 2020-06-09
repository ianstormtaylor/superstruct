import { assert, tuple, string, number } from '../..'
import { test } from '..'

test<[string, number]>((x) => {
  assert(x, tuple([string(), number()]))
  return x
})
