import { assert, regexp } from '../../src'
import { test } from '..'

test<RegExp>((x) => {
  assert(x, regexp())
  return x
})
