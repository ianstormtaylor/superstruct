import { assert, nullable, string, object, enums } from '../../src'
import { test } from '../index.test'

test<string | null>((x) => {
  assert(x, nullable(string()))
  return x
})

test<{ a: string | null }>((x) => {
  assert(x, object({ a: nullable(string()) }))
  return x
})

test<{
  a: 'a'
  b: 'b'
}>(() => {
  return nullable(enums(['a', 'b'])).schema
})
