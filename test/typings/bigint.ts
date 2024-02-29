import { assert, bigint } from '../../src'
import { test } from '../index.test'

test<bigint>((x) => {
  assert(x, bigint())
  return x
})
