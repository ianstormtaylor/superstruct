import { assert, never } from '../../src'
import { test } from '../index.test'

test<never>((x) => {
  assert(x, never())
  return x
})
