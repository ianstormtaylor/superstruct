import { assert, object, number, string } from '../..'
import { test } from '..'

test<Record<string, unknown>>((x) => {
  assert(x, object())
  return x
})

test<{
  a: number
  b: string
}>((x) => {
  assert(x, object({ a: number(), b: string() }))
  return x
})
