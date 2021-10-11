import { assert, bigint } from '../../lib'
import { test } from '..'

test<bigint>((x) => {
  assert(x, bigint())
  return x
})
