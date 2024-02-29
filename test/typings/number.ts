import { assert, number } from '../../src'
import { test } from '../index.test'

test<number>((x) => {
  assert(x, number())
  return x
})
