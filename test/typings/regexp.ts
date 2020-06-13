import { assert, regexp } from '../..'
import { test } from '..'

test<RegExp>((x) => {
  assert(x, regexp())
  return x
})
