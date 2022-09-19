import { assert, type, number } from '../../src'
import { test } from '..'

test<{ a: number }>((x) => {
  assert(x, type({ a: number() }))
  return x
})
