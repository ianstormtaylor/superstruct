import { assert, enums } from '../..'
import { test } from '..'

test<'a' | 'b' | 'c'>((x) => {
  assert(x, enums(['a', 'b', 'c']))
  return x
})

test<1 | 2 | 3>((x) => {
  assert(x, enums([1, 2, 3]))
  return x
})
