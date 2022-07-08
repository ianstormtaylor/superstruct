import { assert, pattern, string } from '../../src'
import { test } from '..'

test<string>((x) => {
  assert(x, pattern(string(), /.*/))
  return x
})
