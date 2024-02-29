import { assert, regexp } from '../../src'
import { test } from '../index.test'

test<RegExp>((x) => {
  assert(x, regexp())
  return x
})
