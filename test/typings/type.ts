import { assert, type, number } from '../..'
import { test } from '..'

test<{ a: number }>((x) => {
  assert(x, type({ a: number() }))
  return x
})
