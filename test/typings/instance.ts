import { assert, instance } from '../../src'
import { test } from '../index.test'

test<Date>((x) => {
  assert(x, instance(Date))
  return x
})
