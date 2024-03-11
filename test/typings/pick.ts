import { assert, pick, object, number, string } from '../../src'
import { test } from '../index.test'

test<{
  b: string
}>((x) => {
  assert(x, pick(object({ a: number(), b: string() }), ['b']))
  return x
})
