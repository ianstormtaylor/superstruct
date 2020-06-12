import { assert, date } from '../..'
import { test } from '..'

test<Date>((x) => {
  assert(x, date())
  return x
})
