import { assert, deprecated, object } from '../..'
import { test } from '..'

test<unknown>((x) => {
  const log = (message: string) => {}
  assert(x, deprecated(log))
  return x
})

test<{ a?: unknown }>((x) => {
  const log = (message: string) => {}
  assert(x, object({ a: deprecated(log) }))
  return x
})
