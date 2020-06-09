import { assert, object, number } from '../..'
import { test } from '..'

test<{ a?: number }>((x) => {
  assert(x, object({ a: number() }))
  return x
})
