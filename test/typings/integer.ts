import { assert, integer } from '../../src'
import { test } from '../index.test'

test<number>((x) => {
  assert(x, integer())
  return x
})
