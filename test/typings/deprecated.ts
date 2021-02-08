import { assert, object, deprecated, any, Context } from '../..'
import { test } from '..'

test<unknown>((x) => {
  const log = (value: unknown, ctx: Context) => {}
  assert(x, deprecated(any(), log))
  return x
})

test<{ a?: unknown }>((x) => {
  const log = (value: unknown, ctx: Context) => {}
  assert(x, object({ a: deprecated(any(), log) }))
  return x
})
