import { assert, instance } from '../../src'
import { test } from '..'

test<Date>((x) => {
  assert(x, instance(Date))
  return x
})
