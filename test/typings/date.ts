import { assert, date } from '../../src'
import { test } from '..'

test<Date>((x) => {
  assert(x, date())
  return x
})
