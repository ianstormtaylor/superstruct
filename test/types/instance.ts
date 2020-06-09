import { assert, instance } from '../..'
import { test } from '..'

test<Date>((x) => {
  assert(x, instance(Date))
  return x
})
