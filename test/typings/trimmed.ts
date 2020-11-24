import { assert, string, trimmed } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(x, trimmed(string()))
  return x
})
