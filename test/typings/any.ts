import { assert, any } from '../../src'
import { test } from '../index.test'

test<any>((x) => {
  assert(x, any())
  return x
})
