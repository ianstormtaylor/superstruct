import { assert, date } from '../../src'
import { test } from '../index.test'

test<Date>((x) => {
  assert(x, date())
  return x
})
