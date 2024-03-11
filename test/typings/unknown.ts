import { assert, unknown } from '../../src'
import { test } from '../index.test'

test<unknown>((x) => {
  assert(x, unknown())
  return x
})
