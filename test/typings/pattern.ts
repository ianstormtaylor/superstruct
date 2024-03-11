import { assert, pattern, string } from '../../src'
import { test } from '../index.test'

test<string>((x) => {
  assert(x, pattern(string(), /.*/))
  return x
})
