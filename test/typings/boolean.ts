import { assert, boolean } from '../../src'
import { test } from '../index.test'

test<boolean>((x) => {
  assert(x, boolean())
  return x
})
