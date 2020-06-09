import { assert, optional, string, object } from '../..'
import { test } from '..'

test<string | undefined>((x) => {
  assert(x, optional(string()))
  return x
})

test<{ a: string | undefined }>((x) => {
  assert(x, object({ a: optional(string()) }))
  return x
})
