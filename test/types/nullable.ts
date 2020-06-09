import { assert, nullable, string, object } from '../..'
import { test } from '..'

test<string | null>((x) => {
  assert(x, nullable(string()))
  return x
})

test<{ a: string | null }>((x) => {
  assert(x, object({ a: nullable(string()) }))
  return x
})
