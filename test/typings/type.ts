import { assert, type, number } from '../../src'
import { test } from '../index.test'

test<{ a: number }>((x) => {
  assert(x, type({ a: number() }))
  return x
})
