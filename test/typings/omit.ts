import { assert, omit, object, number, string, type } from '../../src'
import { test } from '../index.test'

test<{
  b: string
}>((x) => {
  assert(x, omit(object({ a: number(), b: string() }), ['a']))
  return x
})

test<{
  b: string
}>((x) => {
  assert(x, omit(type({ a: number(), b: string() }), ['a']))
  return x
})
