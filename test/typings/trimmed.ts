import { assert, string, trimmed } from '../../src'
import { test } from '../index.test'

test<string>((x) => {
  assert(x, trimmed(string()))
  return x
})
