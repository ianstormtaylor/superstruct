import { assert, number, max } from '../../src'
import { test } from '../index.test'

test<number>((x) => {
  assert(x, max(number(), 0))
  return x
})
