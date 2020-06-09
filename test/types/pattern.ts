import { assert, pattern, string } from '../..'
import { test } from '..'

test<string>((x) => {
  assert(x, pattern(string(), /.*/))
  return x
})
