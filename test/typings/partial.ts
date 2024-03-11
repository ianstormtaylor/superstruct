import { assert, object, number } from '../../src'
import { test } from '../index.test'

test<{ a?: number }>((x) => {
  assert(x, object({ a: number() }))
  return x
})
