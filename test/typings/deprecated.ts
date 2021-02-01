import { assert, object, deprecated, any } from '../..'
import { test } from '..'

test<unknown>((x) => {
  const log = (message: string) => {}
  assert(x, deprecated(any(), log))
  return x
})

test<{ a?: unknown }>((x) => {
  const log = (message: string) => {}
  assert(x, object({ a: deprecated(any(), log) }))
  return x
})
