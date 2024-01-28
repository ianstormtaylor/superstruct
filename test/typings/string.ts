import { assert, string } from '../../src'
import { test } from '../index.test'

test<string>((x) => {
  assert(x, string())
  return x
})
