import { assert, object, number, string } from '../../src'
import { test } from '../index.test'

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
