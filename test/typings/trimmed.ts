import { assert, string, trimmed } from '../../src'
import { test } from '..'

test<string>((x) => {
  assert(x, trimmed(string()))
  return x
})
