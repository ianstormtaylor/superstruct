import { assert, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(x, string())
  return x
})
