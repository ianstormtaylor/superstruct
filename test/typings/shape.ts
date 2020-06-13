import { assert, shape, number } from '../../lib'
import { test } from '..'

test<{ a: number }>((x) => {
  assert(x, shape({ a: number() }))
  return x
})
